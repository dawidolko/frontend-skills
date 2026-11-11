/*
 * state/immer-mutate-or-return: in files that call createSlice, createReducer or produce, reports arrow functions
 * whose parameter is state or draft and whose expression body mutates it (push, splice, sort, an assignment...),
 * because the arrow also returns a value. A block body and a void expression are accepted.
 */
import { findInCode } from '../../js/source.mjs'

const MUTATE = new RegExp(
  '(?:\\(\\s*(?:state|draft)\\b[^()]*\\)|(?<![\\w$.])(?:state|draft))\\s*=>\\s*\\(?\\s*(?:state|draft)\\b' +
    '(?:\\s*\\.\\s*[\\w$]+|\\s*\\[[^\\]]*\\])*' +
    '\\s*(?:\\.\\s*(?:push|pop|shift|unshift|splice|sort|reverse|fill|copyWithin|set|delete|add|clear)\\s*\\(|(?:[-+*/%]|\\?\\?|\\|\\||&&)?=(?![=>]))',
  'g'
)

export default {
  check(ctx) {
    if (!/\b(?:createSlice|createReducer|produce)\s*\(/.test(ctx.text)) return
    for (const f of findInCode(ctx, MUTATE))
      ctx.report(ctx.lineOf(f.index), 'This reducer arrow mutates the draft and returns a value; use a block body or void.')
  }
}
