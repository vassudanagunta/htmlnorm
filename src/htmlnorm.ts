'use strict'

import {Parser, Handler} from 'htmlparser2/lib/Parser.js'
import {escapeForHTML} from './util.js'

const INDENT = '  '

// todo![now] implement at least 'explicit' mode. update bbtest framework.

export type OPTIONS = {
    /** how white space is normalized */
    white_space: 'standard' | 'conservative'

    /** how closing tags are normalized */
    closing_tags: 'as-is' | 'explicit' | 'html5 implicit' | 'strict'

    /** for any tag, the set of attributes that should be excluded */
    attributeExcludes: Map<string, Set<string>>
}

const DEFAULTS: OPTIONS = {
    white_space: 'standard',
    closing_tags: 'as-is',
    attributeExcludes: new Map<string, Set<string>>()
}

const eofWS = /[\t\n\f\r ]$/

/**
 * `htmlnorm` normalizes HTML for reliable tests, semantic diffs, and
 * readability. See README.
 *
 *  @param src HTML to normalize.
 *  @param options
 *  @return normalized HTML. If `src` is malformed, returns `src` unchanged.
 */
export default function htmlnorm (src: string, options?: Partial<OPTIONS>): string {
    const opts: OPTIONS = {...DEFAULTS, ...options}
    // console.log(`htmlnorm invoked:\n    options:`, opts, `\n    src: ${src ? JSON.stringify(src.slice(0,66)).slice(0,-1) + '...' : JSON.stringify(src)}`)

    if (!src || typeof src !== 'string') {
        return src
    }

    const {handler, readResult} = initHandler(opts)
    // todo: recognizeSelfClosing true or false?
    const parser = new Parser(handler, {xmlMode: false, recognizeSelfClosing: false})

    try {
        parser.parseComplete(eofWS.test(src) ? src : src + '\n')
    } catch (e: unknown) {
        // console.log(`htmlnorm exception.`, e)

        // it's a src HTML error, return src as-is per htmlnorm spec
        if (e instanceof Error && e.message.startsWith('[htmlnorm] malformed html:')) {
            return src
        }

        //it's an unexpected internal parser error, rethrow
        throw e
    }

    return readResult()
}

function initHandler (options: OPTIONS): { handler: Partial<Handler>; readResult: () => string } {
    const conservativeWS = options.white_space === 'conservative'
    const explicitClose = options.closing_tags === 'explicit'
    const attributeExcludes = options.attributeExcludes

    let out = ''

    /**
     * We defer writing out an inline run until we know whether we will format
     * it as leaf node content or as the content of an
     * [anonymous block](https://www.w3.org/TR/CSS21/visuren.html#anonymous-block-level).
     * When an inline run is broken up by hard line breaks, each line is an
     * entry in this array.
     */
    const inlineBuf: string[] = []

    /**
     * The parser delivers some runs of text in multiple calls to
     * `ontext`. So far I've noticed it's done so when the source text contains
     * Unicode character references or escaped characters.
     *
     * Using an array to hold such consecutive runs.
     */
    const textBuf: string[] = []

    /**
     * Starts at zero for the root container (the document)
     */
    let blockDepth = 0

    /**
     * Set to true when a `<br>` is encountered. The next element
     * written out must be written on a new line.
     */
    let hardLineBreak = false

    /**
     * Indicates that the inline represented by {@link inlineBuf}
     * lead with whitespace, whether or not it was trimmed.
     * This is used in CONSERVATIVE mode to not introduce
     * whitespace to the output where there was none in the
     * input.
     */
    let inlineBufLeadingWS = false

    /**
     * Indicates that just prior to the current position there
     * was whitespace, whether or now it was written to output.
     * This is used in CONSERVATIVE mode to not introduce
     * whitespace in the output where there was none in the input.
     */
    let trailingWS = false

    /**
     * When true, the leading whitespace of new text
     * encountered will be removed before written
     * to the output. Does not apply within `<pre>`
     * block.
     */
    let trimLeadingWS = true

    /**
     * Whether the current context is a `<pre>` block.
     * We use a counter to represent nested `<pre>` blocks
     * so that the PRE state does not end until the outer
     * most `<pre>` block closes.
     */
    let inPre = 0

    /**
     * How block content nesting is formatted.
     * The default value will always be `container`, and only switched
     * to either of the leaf nodes temporarily for the duration of the
     * leaf node, reverting to `container` by or at the close of the element.
     */
    let nestingFormat: 'container' | 'leaf' | 'container-as-leaf' = 'container'

    /**
     * A stack representing the current element hierarchy.
     * Used to make sure elements are closed properly.
     */
    // todo: DELETE me if we totally abandon tracking openElems
    // const openElems: string[] = []


    function popPreText (): void {
        out += textBuf.join('')
        textBuf.length = 0
        return
    }

    function popText (trimTrailingWS: boolean, dontPopTrailingWS = false): void {
        if (textBuf.length === 0) {
            trailingWS = false
            return
        }

        let s = textBuf.join('')
        textBuf.length = 0
        if (s === '') {
            trailingWS = false
            return
        }

        s = s.replace(/[\t\n\f\r ]+/g, ' ')

        if (dontPopTrailingWS && s.endsWith(' ')) {
            textBuf.push(' ')
            s = s.slice(0, -1)
            if (s === '') {
                trailingWS = false
                return
            }
        }

        if (s === ' ') {
            if (inlineBuf.length === 0) {
                inlineBufLeadingWS = true
            }
            trailingWS = true
            if (trimLeadingWS || trimTrailingWS) {
                // nothing left
                return
            }
            pushInline(' ')
        } else {
            if (s.startsWith(' ')) {
                if (inlineBuf.length === 0) {
                    inlineBufLeadingWS = true
                }
                if (trimLeadingWS) {
                    s = s.slice(1)
                }
            }

            trailingWS = s.endsWith(' ')
            if (trailingWS && trimTrailingWS) {
                s = s.slice(0, -1)
            }

            s = escapeForHTML(s)
            pushInline(s)
        }
    }

    function pushInline (s: string): void {
        if (inlineBuf.length === 0) {
            inlineBuf.push(s)
        } else {
            inlineBuf[inlineBuf.length - 1] += s
        }
    }

    function popInline (asAnonymousBlock: boolean,
                        trimTrailingWS: boolean,
                        dontPopTrailingWS = false): void {
        popText(trimTrailingWS, dontPopTrailingWS)

        if (!inlineBuf[0]) {
            inlineBufLeadingWS = false
            return
        }

        const numLines = inlineBuf.length

        if (asAnonymousBlock && (!conservativeWS || inlineBufLeadingWS)) {
            breakAndIndentLine()
        }
        out += inlineBuf[0]

        hardLineBreak = false
        for (let i = 1; i < numLines; i++) {
            if (inlineBuf[i] === '') {
                hardLineBreak = true
                break
            }

            breakAndIndentLine()
            if (!asAnonymousBlock) {
                out += '    '
            }
            out += inlineBuf[i]
        }

        inlineBuf.length = 0
        inlineBufLeadingWS = false
    }

    function breakAndIndentLine (): void {
        if (out.length === 0) {
            return
        }
        out += '\n'
        if (blockDepth > 0) {
            out += INDENT.repeat(blockDepth)
        }
    }

    function breakAndIndentLineIfCan (): void {
        if (!conservativeWS || trailingWS || hardLineBreak) {
            breakAndIndentLine()
        }
    }

    const handler: Partial<Handler> & { p: Parser } = {
        p: new Parser(), //temp initial value

        onparserinit (p: Parser): void {
            // console.log(`PARSER INIT:`, p)
            this.p = p
        },

        onopentag (name: string, attribs: { [p: string]: string }, isImplied): void {
            // console.log(`${'    '.repeat(blockDepth)}OPEN TAG:`, name, isImplied ? 'implied' : '')

            // treat this as malformed, rejecting htmlparser2's "autofix".
            if (isImplied) {
                throw new Error(`[htmlnorm] malformed html: closing ${name} tag did not have matching open tag`)
            }

            const a = Object.entries(attribs).filter((attr) => {
                return !attributeExcludes.get(name)?.has(attr[0])
            }).sort(([a], [b]) => {
                /* The arguments are lowercase */
                if (a < b) return -1
                if (a > b) return 1
                return 0
            }).map(([name, value]) => {
                if (htmlSpecBoolAttribs.has(name) && (value === '' || value === name)) {
                    return `${name}`
                }
                if (name === 'class') {
                    value = value.trim().split(/[\t\n\f\r ]+/g).sort().join(' ')
                }
                if (value.indexOf('"') >= 0) {
                    if (value.indexOf('\'') === -1) {
                        return `${name}='${value}'`
                    } else {
                        return `${name}="${value.replace(/"/g, '&quot;')}"`
                    }
                }
                return `${name}="${value}"`
            }).join(' ')

            const s = `<${name}${a ? ' ' : ''}${a}>`

            if (inPre !== 0) {
                popPreText()
                out += s
                if (name === 'pre') {
                    inPre++
                }
            } else if (name === 'pre') {
                popInline(true, true)
                if ((!conservativeWS || trailingWS || hardLineBreak) && out.length !== 0 ) {
                    out += '\n'
                }
                out += s
                inPre++
            } else if (leafBlockTags.has(name)) {
                popInline(true, true)
                breakAndIndentLineIfCan()
                out += s
                if (voidTags.has(name)) {
                    trimLeadingWS = true
                } else {
                    trimLeadingWS = !conservativeWS
                    blockDepth++
                    nestingFormat = 'leaf'
                }
            } else if (containerBlockTags.has(name)) {
                popInline(true, true)
                breakAndIndentLineIfCan()
                out += s
                trimLeadingWS = true
                blockDepth++
                nestingFormat = formatAsLeafIfNoNestedBlocks.has(name) ? 'container-as-leaf' : 'container'
            } else { // by default all other tags are treated as inline
                popText(name === 'br')
                pushInline(s)
                if (name === 'br') {
                    // start new inline line
                    inlineBuf.push('')
                    // container elements revert to normal format when inline
                    // spans more than one line. leaf elements not affected.
                    if (nestingFormat === 'container-as-leaf') {
                        nestingFormat = 'container'
                    }
                    // we're starting a newline, which is whitespace,
                    // so any subsequent whitespace can/should be removed.
                    trimLeadingWS = true
                } else {
                    trimLeadingWS = false
                }
            }

            // todo: DELETE me if we totally abandon tracking openElems
            // if (!voidTags.has(name)) {
            //     openElems.push(name)
            // }
        },

        // onopentagname (name: string): void {
        //     console.log(`${'    '.repeat(blockDepth)}OPEN TAG NAME:`, name)
        // },

        // onattribute (name: string, value: string, quote?: string | undefined | null): void {
        //     console.log(`${'    '.repeat(blockDepth)}ATTRIBUTE:`, name, value, quote)
        // },

        onclosetag (name: string, isImplied: boolean): void {
            // console.log(`${'    '.repeat(blockDepth)}CLOSE TAG:`, name, isImplied ? 'implied' : '')

            if (voidTags.has(name)) {
                return
            }

            // todo: 🚩 code for possible STRICT MODE?
            // if (isImplied) {
            //     throw new Error(`[htmlnorm] malformed html: missing closing ${name} tag`)
            // }
            //
            // todo: this check never triggers because of implied open tags.
            // const last = openElems.pop()
            // if (name != last) {
            //     throw new Error(`[htmlnorm] malformed html: close ${name} does not match last open tag, ${last}\n outer tags: ${JSON.stringify(openElems)}`)
            // }

            const s = `</${name}>`
            if (inPre !== 0) {
                popPreText()
                if (explicitClose || !isImplied) {
                    out += s
                }
                if (name === 'pre') {
                    inPre--
                    if (inPre === 0) {
                        trimLeadingWS = true
                    }
                }
            } else if (leafBlockTags.has(name)) {
                if (nestingFormat === 'leaf') {
                    blockDepth--
                    popInline(false, !conservativeWS, isImplied)
                    if (hardLineBreak && (explicitClose || !isImplied)) {
                        breakAndIndentLine()
                        out += '    '
                    }
                    nestingFormat = 'container'
                } else {
                    popInline(true, !conservativeWS, isImplied)
                    blockDepth--
                    if (explicitClose || !isImplied) {
                        breakAndIndentLineIfCan()
                    }
                }
                if (explicitClose || !isImplied) {
                    out += s
                }
                trimLeadingWS = true
            } else if (containerBlockTags.has(name)) {
                if (nestingFormat === 'container-as-leaf') {
                    blockDepth--
                    popInline(false, true, isImplied)
                    nestingFormat = 'container'
                } else {
                    popInline(true, true, false)
                    blockDepth--
                    if (explicitClose || !isImplied) {
                        breakAndIndentLineIfCan()
                    }
                }
                if (explicitClose || !isImplied) {
                    out += s
                }
                trimLeadingWS = true
            } else { // by default all other tags are treated as inline
                if (explicitClose || !isImplied) {
                    popText(false, isImplied)
                    pushInline(s)
                    trimLeadingWS = false
                }
            }
        },

        ontext (text: string): void {
            // console.log(`${'    '.repeat(blockDepth)}TEXT:`, JSON.stringify(text))
            textBuf.push(text)
        },

        // oncomment (data: string): void {
        //     console.log(`${'    '.repeat(blockDepth)}COMMENT:`, JSON.stringify(data))
        // },

        // oncommentend (): void {
        //     console.log(`${'    '.repeat(blockDepth)}COMMENT END`)
        // },

        // oncdatastart (): void {
        //     console.log(`${'    '.repeat(blockDepth)}DATA START`)
        // },

        // oncdataend (): void {
        //     console.log(`${'    '.repeat(blockDepth)}DATA END`)
        // },

        onprocessinginstruction (_name: string, data: string): void {
            // console.log(`PROCESSING INSTRUCTION:`, _name, data)
            out += `<${data}>`
            trimLeadingWS = true
        },

        /**
         * Note: this is triggered by incorrect USAGE of htmlparser2, not
         * anything to do with the HTML being parsed. So irrelevant for
         * htmlnorm's needs. ignore and let htmlparser2 throw an Error.
         */
        // onerror (error: Error): void {
        //     console.log(`ERROR "${error}" ${this.p.startIndex}:${this.p.endIndex}`)
        // },

        onend (): void {
            // console.log(`END`)
            popInline(true, true)
        },

        // onreset (): void {
        //     console.log(`RESET`)
        // }
    }

    function readResult (): string {
        return out
    }

    return {handler, readResult}
}


const inlineTags = new Set([
    'a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite',
    'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img',
    'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript',
    'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small',
    'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var',
    'video', 'wbr', 'text',
    // obsolete inline tags
    'acronym', 'big', 'strike', 'tt'
])

const leafBlockTags = new Set(
    ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'title', 'meta', 'link'])

const containerBlockTags = new Set([
    'html',
    'head',
    'body', 'article', 'section', 'nav', 'aside',
    'main',
    'div',
    'header', 'footer',
    'hgroup',
    'figure', 'figcaption',
    'blockquote',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
    'pre',
    'address',
    'dl', 'dt', 'dd'
])


const formatAsLeafIfNoNestedBlocks = new Set(
    ['li', 'th', 'td', 'dt', 'dd', 'caption', 'figcaption'])


// https://html.spec.whatwg.org/#void-elements
const voidTags = new Set(
    ['area', 'base', 'br', 'col', 'embed', 'hr', 'img',
        'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

if ([...inlineTags, ...leafBlockTags, ...containerBlockTags].length
    !== inlineTags.size + leafBlockTags.size + containerBlockTags.size) {
    throw new Error('internal logic bug: HTML element categories overlap')
}

// https://html.spec.whatwg.org/#attributes-3 ("This section is non-normative.")
const htmlSpecBoolAttribs = new Set([
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected']
)
