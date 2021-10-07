#!/usr/bin/env node
'use strict'

import htmlnorm from './lib/htmlnorm.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const VERSION = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), './package.json'))).version

const USAGE = `
Safely normalize HTML for testing, semantic diffs and readability.

USAGE
   htmlnorm <file>
   htmlnorm --version
   htmlnorm --help

   If no file arg is given, stdin is used.
`

const args = process.argv.slice(2)
let file
if (args.length === 0) {
    file = '/dev/stdin'
} else if (args[0] === '--help') {
    process.stdout.write(USAGE)
    process.exit(0)
} else if (args[0] === '--version') {
    process.stdout.write('htmlnorm ' + VERSION + '\n')
    process.exit(0)
} else {
    file = args[0]
}

const result = htmlnorm(readFileSync(file, 'utf8'))
process.stdout.write(result)
