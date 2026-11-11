/*
 * js/throw-error-objects: reports throw and Promise.reject(...) with a string, template, number or object literal.
 * A thrown call (throw error(404), throw redirect('/')) or variable is left out, since it may well be an Error.
 */
import { findInCode } from '../source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])throw\s+(["'`{]|-?\d)/g))
      ctx.report(ctx.lineOf(f.index), 'Throw an Error object (new Error(message, { cause })), not a literal.')
    for (const f of findInCode(ctx, /\bPromise\s*\.\s*reject\s*\(\s*(["'`{]|-?\d)/g))
      ctx.report(ctx.lineOf(f.index), 'Reject with an Error object, not a literal.')
  }
}
