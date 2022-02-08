'use strict'

import styleToObject from 'style-to-object'

const reTextSpecial = new RegExp('[&<>]', 'g')

const escapeTextChar = function (s: string): string {
    switch (s) {
        case '&':
            return '&amp;'
        case '<':
            return '&lt;'
        case '>':
            return '&gt;'
        default:
            return s
    }
}

export const escapeForHTML = function (s: string): string {
    if (reTextSpecial.test(s)) {
        return s.replace(reTextSpecial, escapeTextChar)
    } else {
        return s
    }
}

export const normalizeStyle = function(style: string): string {
    const parsed = styleToObject(style)
    if (!parsed) return style

    const props: string[] = []
    Object.keys(parsed).forEach(prop => props.push(prop + ': ' + parsed[prop]))
    return props.sort().join('; ')
}
