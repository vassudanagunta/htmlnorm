'use strict'

import fs from 'fs'
import * as commonmark from 'commonmark'
import {escapeForHTML} from './util.js'

import chai from 'chai'
const {assert} = chai
const {strictEqual} = assert

const commonmarkParser = new commonmark.Parser()
const commonmarkRenderer = new commonmark.HtmlRenderer()

function renderMarkdown (src: string): string {
    return commonmarkRenderer.render(commonmarkParser.parse(src))
}

export function decodeSymbols (s: string): string {
    return s.replace(/→/g, '\t')
}

export function encodeSymbols (s: string): string {
    return s.replace(/\t/g, '→')
}


export type BlackBox = (s: string) => string

export type BlackBoxVariation = {
    blackBox: BlackBox
    variation_spec: string[]
}


export type TestSet = {
    title: string
    content: (TestCase | TestSet | string)[]
}

export type TestCase = {
    description: string
    content: (CaseIOVariation | string)[]
}

export type CaseIOVariation = {
    type: 'IN' | 'OUT'
    variation_spec: string[]
    description: string | undefined
    content: string[]
    value: string

    // not sure if we should keep execution stats in the
    // source test case data structure. But for now it's convenient.
    coverageCount: number
}


function insAndOutsFor(tc: TestCase): {inputs: CaseIOVariation[], outputs: CaseIOVariation[]} {
    const inputs: CaseIOVariation[] = []
    const outputs: CaseIOVariation[] = []
    for (const item of tc.content) {
        if (typeof item !== 'string') {
            item.type === 'IN' ? inputs.push(item) : outputs.push(item)
        }
    }
    return {inputs, outputs}
}


function validateCase (tc: TestCase): void {
    const {inputs, outputs} = insAndOutsFor(tc)
    if (inputs.length === 0 || outputs.length === 0) {
        console.error('incomplete case')
        console.error(tc)
        process.exit(-1)
    }
}

function isSubset(a: string[], b:string[]): boolean {
    return a.every(val => b.includes(val))
}

// todo[api] if this API is used, we can offer the option to collate the
//   results of each variation, i.e. instead of grouping all tests by
//   black box variation, grouping them by test case. Thus, for example,
//   the results of Test Case X for each black box variation would appear
//   together, rather than in separate trees.
export function testBlackBoxVariations (bbVariations: BlackBoxVariation[],
                                        testSet: TestSet): void {
    for (const bbv of bbVariations) {
        testBlackBoxVariation(bbv, testSet)
    }
}

export function testBlackBoxVariation (bbVariation: BlackBoxVariation, testSet: TestSet): void {
    testSet.content.forEach(function (item: string | TestSet | TestCase) {
        if (typeof item === 'string') {
            //just documentation
        } else if ('description' in item) {
            // TestCase
            const {inputs, outputs} = insAndOutsFor(item)
            for (const i of inputs) {
                const input = i.value

                // Find the most narrow match for the given black box's variation spec.
                //
                // The process is one of elimination:
                //  - A candidate match is a CaseIOVariation whose
                //    `variation_spec` is a subset of the black box's.
                //  - If one match's variation_spec is a subset of another
                //    match's, then the latter is a more narrow match. The
                //    former is removed as a match.
                //  - If at the end only narrowed match remains, it is the most
                //    narrow, and will be the variation spec used to test this
                //    black box variation.
                //  - But if more than one remains, the test case is considered
                //    ambiguous and the test is aborted.
                //
                // The implementation may not look it, but it is semantically
                // equivalent to the above.
                let narrowedMatches: CaseIOVariation[] = []
                nextOUT:
                for (const candidate of outputs) {
                    // if candidate matches
                    if (isSubset(candidate.variation_spec, bbVariation.variation_spec)) {
                        // filter out existing matches less narrow than candidate
                        narrowedMatches = narrowedMatches.filter(
                            nm => !isSubset(nm.variation_spec, candidate.variation_spec)
                        )
                        // now make sure candidate is at least as narrow as
                        // all narrowedMatches
                        for (const nm of narrowedMatches) {
                            if (isSubset(candidate.variation_spec, nm.variation_spec)) {
                                // narrowedMatches is less specific, reject
                                continue nextOUT
                            }
                        }
                        narrowedMatches.push(candidate)
                    }
                }

                if (narrowedMatches.length > 1) {
                    const nmSpecs = narrowedMatches
                        .reduce((s , v) => `${s}, [${v.variation_spec}]` , '')
                        .slice(2)
                    console.error(`Test case "${item.description}" is ambiguous. ` +
                                  `For the black box variation [${bbVariation.variation_spec}], ` +
                                  `more than one OUT variation matches: ${nmSpecs}`)
                    process.exit(-1)
                } else if (narrowedMatches[0]) {
                    narrowedMatches[0].coverageCount++
                    const expected = narrowedMatches[0].value
                    test(item.description, function () {
                        const output = bbVariation.blackBox(decodeSymbols(input))
                        strictEqual(output, decodeSymbols(expected))
                    })
                } else {
                    // no match was found. This is not an error, at least per
                    // current rules

                    // todo[spec]: should this be an error? Should *every* testVariation
                    //    execute *every* test case?
                }

            }

        } else if (item.title) {
            // TestSet
            suite(item.title, function () {
                testBlackBoxVariation(bbVariation, item)
            })
        }
    })
}

export function verifyTestCasesFullCoverage(testSet: TestSet): void {
    verifyCoverageRecursively(testSet, '')
}

function verifyCoverageRecursively(testSet: TestSet, parentID: string): void {
    const setID = parentID + '/' + testSet.title
    testSet.content.forEach(function (item: string | TestSet | TestCase) {
        if (typeof item === 'string') {
            //just documentation
        } else if ('description' in item) {
            // TestCase
            const caseID = setID + '/' + item.description
            const {outputs} = insAndOutsFor(item)
            for (const out of outputs) {
                const outID = `${caseID} [${out.type}${out.variation_spec.length > 0 ? ': ' + out.variation_spec.join(', ') : ''}]`
                console.log(out.coverageCount, outID)
                if (out.coverageCount === 0) {
                    console.error(`zero coverage for: ${outID}`)
                    process.exit(-1)
                }
            }
        } else if (item.title) {
            // TestSet
            verifyCoverageRecursively(item, setID)
        }
    })
}

/**
 * extract test cases.
 *
 * This will eventually be replaced by `plaintests` and the
 * TextPlain parser.
 */
export function extractTestSet (caseFilePath: string): TestSet {
    const src = fs.readFileSync(caseFilePath, 'utf8')
        .replace(/\r\n?/g, '\n') // Normalize newlines for platform independence

    const rootSet: TestSet = {title: '', content: []}
    let curLevel = 0

    let curSet = rootSet
    const setStack: [TestSet, number][] = []

    let curCase: TestCase | undefined
    let curCaseInputs = 0
    let curCaseIO: CaseIOVariation | undefined

    src.replace(/^(#{1,6}) *(.*)$|^`{32,}\n([\s\S]*?)^`{32,}$|^((?:(?!```)[^\n][^\n]+\n)+)/gm,
        function (_, headingLevel, headingTitle, codeBlock, other): string {
            if (headingLevel && headingTitle) {
                const level = headingLevel.length

                if (headingTitle.startsWith('[CASE]')) {
                    if (level <= curLevel) {
                        console.error(`malformed test hierarchy: case must have deeper heading level than parent section: ${headingTitle}`)
                        process.exit(-1)
                    }

                    if (curCase) {
                        // validate last case before moving to the next one
                        validateCase(curCase)
                    }
                    curCase = {
                        description: headingTitle.slice(6).trim(),
                        content: []
                    }
                    curSet.content.push(curCase)
                    curCaseInputs = 0
                    curCaseIO = undefined

                } else {
                    // new section terminates curCase
                    if (curCase) {
                        // validate last case before moving to the next one
                        validateCase(curCase)
                        curCase = undefined
                        curCaseInputs = 0
                    }

                    // while level is not deeper than curLevel, pop out levels
                    while (level <= curLevel) {
                        [curSet, curLevel] = setStack.pop() as [TestSet, number]
                    }

                    //console.log(`${'    '.repeat(curLevel)} ${headingTitle}`)

                    const set = {
                        title: headingTitle,
                        content: []
                    }
                    curSet.content.push(set)
                    setStack.push([curSet, curLevel])
                    curSet = set
                    curCaseIO = undefined
                    curLevel = level
                }

            } else if (other) {
                //console.log(other)
                const ioMatch = other.match(/^\[(IN|OUT)(?:: ([^[]+))?](.*)/)
                if (ioMatch) {
                    //console.log('  ', ioMatch)
                    if (!curCase) {
                        console.error(`[${ioMatch[1]}] without preceding [CASE]:\n ${other}`)
                        process.exit(-1)
                    }
                    if (curCaseIO) {
                        console.error('incomplete case')
                        console.error(curCase)
                        process.exit(-1)
                    }
                    curCaseIO = {
                        type: ioMatch[1],
                        variation_spec: ioMatch[2] ? ioMatch[2].split(/[ ,]+/) : [],
                        description: ioMatch[3].trim(),
                        content: [],
                        value: '😭',
                        coverageCount: 0
                    }
                    //console.log(curIO)
                    if (curCaseIO.type === 'IN') {
                        if (curCaseInputs > 0) {
                            console.error(`multiple [IN] not yet supported:\n ${other}`)
                            console.error(curCase)
                            process.exit(-1)
                        }
                        if (curCaseIO.variation_spec.length !== 0) {
                            console.error(`variations not (yet) supported for [IN]:\n ${other}`)
                            console.error(curCase)
                            process.exit(-1)
                        }
                        curCaseInputs++
                    } else {
                        if (curCaseInputs === 0) {
                            console.error(`[OUT] without preceding [IN]:\n ${other}`)
                            console.error(curCase)
                            process.exit(-1)
                        }
                    }
                    curCase.content.push(curCaseIO)
                } else {
                    if (curCaseIO) {
                        curCaseIO.content.push(other)
                    } else if (curCase) {
                        curCase.content.push(other)
                    } else {
                        curSet.content.push(other)
                    }
                }

            } else if (codeBlock) {
                codeBlock = codeBlock.slice(0, -1)
                if (curCaseIO) {
                    // code block is an IN or OUT spec
                    curCaseIO.value = codeBlock
                    curCaseIO = undefined
                } else {
                    // just a free floating code block
                    curSet.content.push(codeBlock)
                }
            } else {
                throw new Error('internal logic error: unexpected if-else path')
            }

            return 'dummy'
        })

    // if the case file doesn't start with a heading, it will parse as
    // a TestSet without a title, and any encountered headings will appear
    // as subsets.
    if (rootSet.title === '') {
        // If there is only one subset, it should be treated as the rootSet.
        // Though that would men the content above its heading will be discarded.
        if (rootSet.content.length === 1) {
            return rootSet.content[0] as TestSet
        }

        rootSet.title = 'tests'
    }


    return rootSet
}


export function generateDocumentation (testSet: TestSet, functionName: string, docPath: string): void {
    let buf = `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8">
    <title>${testSet.title}<em>visual sanity check</em></title>
    <style>
        .test-case {
            margin: 15px 0 15px 40px;
            /*border: 1px solid black;*/
            table-layout: fixed;
        }
        .test-case td {
            padding: 5px 10px;
            vertical-align: top;
        }
        .html {
            min-width: 15em;
            max-width: 50vw;
            overflow: scroll;
            white-space: pre;
            background-color: lightgray;
            font-family: monospace;
        }
        .rendered {
            min-width: 15em;
            max-width: 40vw;
            border: 1px solid darkgray;
            padding: 5px;
            overflow: scroll;
            font-family: monospace;
        }
        code {
            background-color: lightgray;
        }
        blockquote {
            margin: 20px 20px 20px 20px;
            padding: 0 10px 0 10px;
            border-left: 2px solid #eee;
        }
    </style>
</head>
<body>
    <div style="background-color: yellow; width:75%; margin: auto;">
        <h2>browser study of <code>${testSet.title}</code> test cases</i></h2>
        <p>This is an HTML rendering of <code>${testSet.title}</code>'s unit test data.
        It is automatically generated each time the tests are run. It serves as
        a visual sanity check of the test data's assumptions about how whitespace
        runs are collapsed by the browser.</p>

        <p>When opened in a browser, the
        rendered <code>input</code>, <code>output</code> and <code>expected</code>
        values should be visually identical. If not, it means either the test
        assumptions are wrong or the browser being used is flawed. Far more
        likely the former.</p>

        <p><code>expected</code> is only shown if the actual output does not
        match it.</p>
    </div>`

    buf = generateHTMLForSet(testSet, 1, buf, functionName)

    buf += '</body></html>'

    fs.writeFileSync(docPath, buf)

    process.stdout.write(`📜 HTML render of test cases written to: ${docPath}\n`)
}


function generateHTMLForSet (testSet: TestSet, level: number, buf: string, functionName: string): string {
    buf += renderMarkdown(`${'#'.repeat(level)} ${testSet.title}`)

    testSet.content.forEach(function (item) {
        if (typeof item === 'string') {
            buf += renderMarkdown(item)
        } else if ('description' in item) {
            buf = generateHTMLForCase(item, buf, functionName)
        } else if (item.title) {
            buf = generateHTMLForSet(item, level + 1, buf, functionName)
        } else {
            throw new Error(`unexpected ${JSON.stringify(item)} in ${testSet.title}`)
        }
    })

    return buf
}

function generateHTMLForCase (testCase: TestCase, buf: string, functionName: string): string {
    buf += `\n${renderMarkdown('🧪 ' + testCase.description)}\n`

    let i = 0
    while (i < testCase.content.length) {
        let item = testCase.content[i] as CaseIOVariation|string
        if (typeof item === 'string') {
            buf += renderMarkdown(item)
            i++
        } else {
            buf += '<table class="test-case">\n'
            buf += '  <tr> <th></th> <th>raw</th> <th>rendered</th> </tr>\n'

            do {
                const what = item.type === 'IN' ? 'input' : `${functionName}(input)`
                const val = decodeSymbols(item.value)
                buf += '  <tr>\n'
                buf += `    <td>${what} [${item.variation_spec}] ${item.description ? '<br>' + item.description : ''}\n`
                const c = item.content
                for (let j = 0; j < c.length; j++) {
                        buf += `      <p>${c[j]}</p>`
                }
                buf += `      </td>\n`
                buf += `    <td><div class="html">${escapeForHTML(item.value)}</div></td>`
                buf += `    <td><div class="rendered">${val}</div></td>\n`
                buf += '  </tr>\n'

                i++
                item = testCase.content[i] as CaseIOVariation|string
            } while (i < testCase.content.length && typeof item !== 'string')

            buf += `</table><br><br>\n`
        }
    }


    return buf
}

