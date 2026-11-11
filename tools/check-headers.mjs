#!/usr/bin/env node
/*
 * Checks that every JavaScript source file of the repository starts with one block comment that says what the file
 * is for (after an optional shebang line), as the contribution rules require. Markdown, JSON and YAML are not
 * checked; they carry no header. Usage: node tools/check-headers.mjs
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { PACKAGE_ROOT } from '../cli/lib/catalog.mjs'

const DIRS = ['cli', 'engine', 'adapters', 'rules', 'skills', 'tools', 'test']
const problems = []
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'fixtures') continue
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(mjs|cjs|js)$/.test(e.name)) {
      const text = readFileSync(p, 'utf8').replace(/^#!.*\n/, '')
      const m = /^\/\*\n([\s\S]*?)\*\/\n/.exec(text)
      if (!m || m[1].trim().split('\n').length < 1 || m[1].replace(/[\s*]/g, '').length < 40)
        problems.push(path.relative(PACKAGE_ROOT, p).split(path.sep).join('/'))
    }
  }
}
for (const d of DIRS) walk(path.join(PACKAGE_ROOT, d))
for (const p of problems) process.stdout.write(`${p}: no header block comment saying what the file is for\n`)
process.stdout.write(problems.length ? `${problems.length} file(s) without a header.\n` : 'Every source file has a header.\n')
process.exitCode = problems.length ? 1 : 0
