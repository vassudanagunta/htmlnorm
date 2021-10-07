'use strict'

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
