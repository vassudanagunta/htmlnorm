'use strict'

import htmlnorm from '../lib/htmlnorm.js'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
    extractTestSet,
    testBlackBoxVariation,
    verifyTestCasesFullCoverage,
    generateDocumentation
} from '../lib/blackboxIOTesting.js'

import chai from 'chai'

const {assert} = chai
const {strictEqual, isNull, isUndefined} = assert

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const testSet = extractTestSet(path.join(__dirname, 'htmlnorm.test.md'))

// the are applied to all variations
const attributeExcludes= new Map()
attributeExcludes.set('input', new Set(['exclude', 'itemscope']))


// using separate testBlackBoxVariation calls so that in the IDE I can
//  selectively test only one variation

suite('htmlnorm STANDARD', function () {
    testBlackBoxVariation(
        {
            blackBox: (s) => htmlnorm(s, { attributeExcludes: attributeExcludes }),
            variation_spec: ['STANDARD']
        },
        testSet)
})

suite('htmlnorm CONSERVATIVE', function () {
    testBlackBoxVariation(
        {
            blackBox: (s) => htmlnorm(s, { white_space: 'conservative', attributeExcludes: attributeExcludes }),
            variation_spec: ['CONSERVATIVE']
        },
        testSet)
})

suite('htmlnorm EXPLICIT_CLOSE', function () {
    testBlackBoxVariation(
        {
            blackBox: (s) => htmlnorm(s, { closing_tags: 'explicit', attributeExcludes: attributeExcludes }),
            variation_spec: ['EXPLICIT_CLOSE']
        },
        testSet)
})

suite('htmlnorm EXPLICIT_CLOSE + CONSERVATIVE', function () {
    testBlackBoxVariation(
        {
            blackBox: (s) => htmlnorm(s, { closing_tags: 'explicit', white_space: 'conservative', attributeExcludes: attributeExcludes }),
            variation_spec: ['EXPLICIT_CLOSE', 'CONSERVATIVE']
        },
        testSet)
})

/**
 * Given invalid inputs, `htmlnorm` simply returns the same value back.
 */
suite('htmlnorm non string inputs', function () {

    test('number', function () {
        strictEqual(htmlnorm(123), 123)
    })

    test('object', function () {
        const obj = { a: 1, b: 2 }
        strictEqual(htmlnorm(obj), obj)
    })

    test('array', function () {
        const array = ['<p>HTML in an array</p>p>']
        strictEqual(htmlnorm(array), array)
    })

    test('null', function () {
        isNull(htmlnorm(null))
    })

    test('undefined', function () {
        isUndefined(htmlnorm(undefined))
    })

})

verifyTestCasesFullCoverage(testSet)

generateDocumentation(testSet, 'htmlnorm', path.join(__dirname, 'htmlnorm.test.html'))


const IN_OUT_HEADINGS = false

//rewriteTestFile(path.join(__dirname, 'htmlnorm.NEW.test.md'))


/**
 * @returns {void}
 */
function rewriteTestFile (outPath) {
    let buf = ''
    buf = generateTestSourceForSet(testSet, 1, buf)
    buf += '\n'

    fs.writeFileSync(outPath, buf)
    process.stdout.write(`📜 HTML render of test cases written to: ${outPath}\n`)
}


/**
 * @param {TestSet} testSet
 * @param {number} level
 * @param {string} buf
 * @returns {string} buf
 */
function generateTestSourceForSet (testSet, level, buf) {
    if (level > 1) {
        buf += '\n\n\n'
    }
    buf += `${'#'.repeat(level)} ${testSet.title}\n\n`

    testSet.content.forEach(function (item) {
        if (typeof item === 'string') {
            buf += item
            buf += '\n\n'
        } else if ('description' in item) {
            buf = generateTestSourceForCase(item, level, buf)
        } else if ('title' in item) {
            buf = generateTestSourceForSet(item, level + 1, buf)
        } else {
            throw new Error(`unexpected ${JSON.stringify(item)} in ${testSet.title}`)
        }
    })

    return buf
}

/**
 * @param {TestCase} testCase
 * @param {number} level
 * @param {string} buf
 * @returns {string}
 */
function generateTestSourceForCase (testCase, level, buf) {

    buf += `
${'#'.repeat(level + 1)} [CASE] ${testCase.description}
${IN_OUT_HEADINGS ? '#'.repeat(level + 2) + ' ' : ''}[IN]
`
    buf += '``````````````````````````````````````````````````\n'
    buf += testCase.input + '\n'
    buf += '``````````````````````````````````````````````````\n'
    buf += `${IN_OUT_HEADINGS ? '#'.repeat(level + 2) + ' ' : ''}[OUT, CONSERVATIVE]\n`
    buf += '``````````````````````````````````````````````````\n'
    buf += testCase.expected + '\n'
    buf += '``````````````````````````````````````````````````\n'
    buf += `${IN_OUT_HEADINGS ? '#'.repeat(level + 2) + ' ' : ''}[OUT, STANDARD]\n`
    buf += '``````````````````````````````````````````````````\n'
    buf += testCase.expected + '\n'
    buf += '``````````````````````````````````````````````````\n'

    return buf
}


