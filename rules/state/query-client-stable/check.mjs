/*
 * state/query-client-stable: reports new QueryClient(...) inside the body of a component or hook (a function named
 * with a capital letter or use...), unless it is the initialiser of useState, useRef or useMemo. Module-level clients
 * and factory helpers (getQueryClient, makeQueryClient) are left out.
 */
import { closing, findInCode } from '../../js/source.mjs'

const FN =
  /(?:function\s+([\w$]+)\s*(?=\()|(?:const|let|var)\s+([\w$]+)\s*=\s*(?:async\s*)?(?=\()|(?:const|let|var)\s+([\w$]+)\s*=\s*(?:async\s+)?function\s*[\w$]*\s*(?=\())/g

/** The index of the "{" that opens the body of the function whose parameters start at code[paren], or -1. */
function bodyBrace(code, paren) {
  const end = closing(code, paren)
  if (end < 0) return -1
  const m = /^\s*(?::[^={]*)?(=>)?\s*\{/.exec(code.slice(end, end + 200))
  return m ? end + m[0].length - 1 : -1
}

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])new\s+QueryClient\s*\(/g)) {
      const before = f.code.slice(Math.max(0, f.match.index - 80), f.match.index)
      if (/(?:useState|useRef|useMemo)\s*\(\s*(?:\(\s*\)\s*=>\s*(?:\{\s*return\s*)?)?$/.test(before)) continue
      let owner = null
      FN.lastIndex = 0
      for (const m of f.code.matchAll(FN)) {
        if (m.index >= f.match.index) break
        const brace = bodyBrace(f.code, m.index + m[0].length)
        if (brace < 0 || brace > f.match.index) continue
        const end = closing(f.code, brace)
        if (end > f.match.index) owner = m[1] || m[2] || m[3]
      }
      if (owner && /^(?:[A-Z]|use[A-Z])/.test(owner))
        ctx.report(ctx.lineOf(f.index), `${owner} creates a new QueryClient on every render; create it once with useState(() => new QueryClient()).`)
    }
  }
}
