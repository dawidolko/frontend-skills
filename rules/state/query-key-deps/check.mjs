/*
 * state/query-key-deps: reads useQuery, useInfiniteQuery, useSuspenseQuery, queryOptions, createQuery,
 * injectQuery, prefetchQuery, fetchQuery and ensureQueryData calls whose options have a literal queryKey and an
 * inline queryFn, and reports variables the function reads that the key does not mention. Function call targets,
 * the function's own parameters and locals, imports, module-level names, globals and capitalised names (types,
 * classes, constants) are not dependencies. A key that is only a variable cannot be read and is skipped.
 */
import { closing, findInCode } from '../../js/source.mjs'

const CALLS =
  /(?<![\w$.])(?:useQuery|useInfiniteQuery|useSuspenseQuery|useSuspenseInfiniteQuery|queryOptions|infiniteQueryOptions|createQuery|createInfiniteQuery|injectQuery|prefetchQuery|fetchQuery|ensureQueryData)\s*\(/g
const GLOBALS = new Set(
  (
    'await async return const let var function new typeof instanceof void delete in of if else for while do switch case break continue try catch ' +
    'finally throw this super null undefined true false NaN Infinity window document globalThis self navigator location fetch console JSON Math ' +
    'Number String Boolean Object Array Promise Date URL Error encodeURIComponent decodeURIComponent setTimeout clearTimeout structuredClone ' +
    'string number boolean unknown any never object as satisfies keyof readonly import process'
  ).split(' ')
)

/** The end of the expression that starts at i: the next top-level comma or closing bracket. */
function exprEnd(code, i, limit) {
  let depth = 0
  for (; i < limit; i++) {
    const c = code[i]
    if ('([{'.includes(c)) depth++
    else if (')]}'.includes(c)) {
      if (depth === 0) return i
      depth--
    } else if (c === ',' && depth === 0) return i
  }
  return limit
}

const words = (s) => [...s.matchAll(/(?<![\w$.])[A-Za-z_$][\w$]*/g)].map((m) => m[0])

function moduleNames(code) {
  const out = new Set()
  for (const m of code.matchAll(/import\s+([^;]*?)\s+from\b/g)) for (const w of words(m[1].replace(/\bas\b/g, ' '))) out.add(w)
  for (const m of code.matchAll(/^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:const|let|var|function\*?|class)\s+([\w$]+)/gm)) out.add(m[1])
  return out
}

export default {
  check(ctx) {
    for (const f of findInCode(ctx, CALLS)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const body = f.code.slice(open + 1, end - 1)
      const keyAt = /(?<![\w$])queryKey\s*:\s*/.exec(body)
      const fnAt = /(?<![\w$])queryFn\s*:\s*/.exec(body)
      if (!keyAt || !fnAt) continue
      const base = open + 1
      const keyStart = base + keyAt.index + keyAt[0].length
      const key = f.code.slice(keyStart, exprEnd(f.code, keyStart, end - 1))
      if (/^[\w$]+$/.test(key.trim())) continue
      const fnStart = base + fnAt.index + fnAt[0].length
      const fn = f.code.slice(fnStart, exprEnd(f.code, fnStart, end - 1))
      const arrow =
        /^(?:async\s+)?(\([^()]*(?:\([^()]*\)[^()]*)*\)|[\w$]+)\s*(?::[^=]*)?=>/.exec(fn.trim()) ||
        /^(?:async\s+)?function\s*[\w$]*\s*\(([^()]*)\)/.exec(fn.trim())
      if (!arrow) continue
      const fnBody = fn.trim().slice(arrow[0].length)
      const local = new Set([...words(arrow[1]), ...moduleNames(f.code)])
      for (const m of fnBody.matchAll(/(?:const|let|var)\s+([^=;]+?)\s*=/g)) for (const w of words(m[1])) local.add(w)
      for (const m of fnBody.matchAll(/\(([^()]*)\)\s*(?::[^=]*)?=>|([\w$]+)\s*=>|function\s*[\w$]*\s*\(([^()]*)\)|catch\s*\(([^()]*)\)/g))
        for (const w of words(m[1] || m[2] || m[3] || m[4] || '')) local.add(w)
      const missing = new Set()
      for (const m of fnBody.matchAll(/(?<![\w$.])[A-Za-z_$][\w$]*/g)) {
        const name = m[0]
        const after = fnBody.slice(m.index + name.length)
        if (GLOBALS.has(name) || local.has(name) || /^[A-Z]/.test(name) || (name === '$' && after[0] === '{')) continue
        if (/^\s*\(/.test(after) || /^\s*:(?!:)/.test(after)) continue
        if (new RegExp(`(?<![\\w$.])${name.replace(/\$/g, '\\$')}(?![\\w$])`).test(key)) continue
        missing.add(name)
      }
      if (missing.size)
        ctx.report(
          ctx.lineOf(f.offset + fnStart),
          `queryFn reads ${[...missing].join(', ')}, which the queryKey does not include; add ${missing.size > 1 ? 'them' : 'it'} to the key.`
        )
    }
  }
}
