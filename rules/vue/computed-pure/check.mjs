/*
 * vue/computed-pure: reports computed(async ...) and computed getters that call fetch, $fetch or axios or assign to
 * another ref's .value. A computed with a { get, set } object is checked only for async work, since its setter
 * is meant to write.
 */
import { closing, findInCode } from '../../js/source.mjs'

const REQUEST = /(?<![\w$.])(?:\$?fetch|axios(?:\s*\.\s*\w+)?)\s*\(/
const WRITE = /(?<![\w$.])[\w$]+\s*\.\s*value\s*(?:[-+*/%]?=(?![=>])|\+\+|--)/

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])computed\s*(?:<[^>\n]*>)?\s*\(/g)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const body = f.code.slice(open + 1, end - 1)
      const line = ctx.lineOf(f.index)
      if (/^\s*async\b/.test(body)) ctx.report(line, 'computed() with an async getter returns a promise; load in a watcher and derive from a ref.')
      else if (REQUEST.test(body)) ctx.report(line, 'This computed starts a request; load data in a watcher or loader, not in a computed.')
      else if (!/^\s*\{/.test(body) && WRITE.test(body)) ctx.report(line, 'This computed changes other state; keep the getter pure.')
    }
  }
}
