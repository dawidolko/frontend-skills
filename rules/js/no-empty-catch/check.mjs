/*
 * js/no-empty-catch: reports catch blocks and .catch() callbacks whose body is empty. A block that holds a comment
 * is accepted, since the comment states why the error is ignored.
 */
import { findInCode } from '../source.mjs'

const hasComment = (raw, from, to) => /\/\/|\/\*/.test(raw.slice(from, to))

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /\bcatch\s*(?:\([^()]*\))?\s*\{(\s*)\}/g)) {
      const open = f.match.index + f.match[0].lastIndexOf('{')
      if (!hasComment(f.raw, open, open + f.match[1].length + 2)) ctx.report(ctx.lineOf(f.index), 'This catch block ignores the error; handle, report or rethrow it.')
    }
    for (const f of findInCode(ctx, /\.\s*catch\s*\(\s*(?:\(\s*[\w$]*\s*\)|[\w$]+)\s*=>\s*\{(\s*)\}\s*\)/g)) {
      const open = f.match.index + f.match[0].lastIndexOf('{')
      if (!hasComment(f.raw, open, open + f.match[1].length + 2)) ctx.report(ctx.lineOf(f.index), 'This .catch() ignores the error; handle, report or rethrow it.')
    }
  }
}
