/*
 * js/no-eval: reports eval(...), new Function(...) and setTimeout/setInterval whose first argument is a string
 * literal, in script code. A method named eval on another object (page.eval in a test tool) is left out.
 */
import { findInCode } from '../source.mjs'

const PATTERNS = [
  [/(?<![\w$.])(?:(?:window|globalThis|self)\s*\.\s*)?eval\s*\(/g, 'eval() runs a string as code; pass data, not code.'],
  [/(?<![\w$.])new\s+Function\s*\(/g, 'new Function() runs a string as code; write a normal function.'],
  [/(?<![\w$.])(?:(?:window|globalThis|self)\s*\.\s*)?(setTimeout|setInterval)\s*\(\s*["'`]/g, 'Pass a function to the timer, not a string of code.']
]

export default {
  check(ctx) {
    for (const [re, message] of PATTERNS) for (const f of findInCode(ctx, re)) ctx.report(ctx.lineOf(f.index), message)
  }
}
