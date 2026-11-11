/*
 * Command-line plumbing shared by the commands: a small argument parser (--flag, --key value, --key=value, short
 * positional arguments), yes/no and choice prompts that only ask on an interactive terminal, the package version,
 * today's date, and a usage error that the dispatcher turns into exit code 2.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { PACKAGE_ROOT } from './catalog.mjs'

export class UsageError extends Error {}

/** Parses argv. booleans lists flags that never take a value. */
export function parseArgs(argv, booleans = []) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--') {
      out._.push(...argv.slice(i + 1))
      break
    }
    if (a.startsWith('--')) {
      const eq = a.indexOf('=')
      const key = eq === -1 ? a.slice(2) : a.slice(2, eq)
      if (eq !== -1) out[key] = a.slice(eq + 1)
      else if (key.startsWith('no-')) out[key.slice(3)] = false
      else if (booleans.includes(key) || i + 1 >= argv.length || argv[i + 1].startsWith('--')) out[key] = true
      else out[key] = argv[++i]
    } else if (a === '-y') out.yes = true
    else if (a === '-h') out.help = true
    else out._.push(a)
  }
  return out
}

export const version = () => JSON.parse(readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).version
export const today = () => new Date().toISOString().slice(0, 10)
export const interactive = () => Boolean(process.stdin.isTTY && process.stdout.isTTY)

/** Asks a yes/no question; false when not interactive. */
export async function confirm(question, { input = process.stdin, output = process.stdout } = {}) {
  if (!interactive()) return false
  const rl = createInterface({ input, output })
  try {
    const answer = (await rl.question(`${question} [y/N] `)).trim().toLowerCase()
    return answer === 'y' || answer === 'yes'
  } finally {
    rl.close()
  }
}

/** Asks for one or more numbered choices ("1,3"); returns the chosen values or []. */
export async function choose(question, options, { input = process.stdin, output = process.stdout } = {}) {
  if (!interactive()) return []
  output.write(`${question}\n${options.map((o, i) => `  ${i + 1}. ${o.label}`).join('\n')}\n`)
  const rl = createInterface({ input, output })
  try {
    const answer = await rl.question('Numbers, separated by commas: ')
    return answer
      .split(/[\s,]+/)
      .map((n) => options[Number(n) - 1])
      .filter(Boolean)
      .map((o) => o.value)
  } finally {
    rl.close()
  }
}

/** The project root from --cwd or the current folder. */
export const rootOf = (args) => path.resolve(typeof args.cwd === 'string' ? args.cwd : '.')

export const list = (v) => (typeof v === 'string' ? v.split(',').map((x) => x.trim()).filter(Boolean) : [])
