/*
 * state/fetch-effect-cleanup: reports useEffect and useLayoutEffect callbacks that call fetch or axios and a state
 * setter (set...) but never return a cleanup function. A returned arrow, function or variable counts as a cleanup;
 * an inner return inside a .then callback does not.
 */
import { closing, findInCode } from '../../js/source.mjs'

const REQUEST = /(?<![\w$.])(?:fetch|axios(?:\s*\.\s*(?:get|post|put|patch|delete|request))?)\s*\(/
const SETTER = /(?<![\w$.])set[A-Z][\w$]*\s*\(|\.\s*then\s*\(\s*set[A-Z][\w$]*\s*[,)]/

/** The body with every nested function body removed, so only the effect's own returns remain. */
function ownLevel(body) {
  let out = ''
  let i = 0
  while (i < body.length) {
    const arrow = /^=>\s*\{/.exec(body.slice(i, i + 40)) || /^function\b[^{]*\{/.exec(body.slice(i, i + 200))
    if (arrow) {
      const open = i + arrow[0].length - 1
      const end = closing(body, open)
      if (end > 0) {
        out += ' '.repeat(end - i)
        i = end
        continue
      }
    }
    out += body[i++]
  }
  return out
}

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])(?:React\s*\.\s*)?(?:useEffect|useLayoutEffect)\s*\(\s*(?:\(\s*\)|async\s*\(\s*\))\s*=>\s*\{/g)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const body = f.code.slice(open + 1, end - 1)
      if (!REQUEST.test(body) || !SETTER.test(body)) continue
      if (/(?<![\w$.])return\s*(?:\(|function\b|[\w$]+\s*(?:;|$|\n))/.test(ownLevel(body))) continue
      ctx.report(ctx.lineOf(f.index), 'This effect fetches into state without a cleanup; ignore or abort stale responses, or use a loader or query library.')
    }
  }
}
