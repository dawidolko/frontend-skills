/*
 * ts/validate-untrusted: in TypeScript code, reports a response body (x.json()) or JSON.parse(...) result that is
 * cast with "as T" or assigned to a declaration annotated with a type, instead of being validated. "as const",
 * "as unknown" and an "unknown" annotation are accepted, and so is any call that wraps the value (parse(...)).
 */
import { closing, findInCode } from '../../js/source.mjs'

const UNTYPED = /^(?:unknown|any)\b/

function sourceEnd(code, start) {
  const json = /^(?:await\s+)?[\w$.]+\s*\.\s*json\s*\(\s*\)/.exec(code.slice(start))
  if (json) return start + json[0].length
  const parse = /^JSON\s*\.\s*parse\s*\(/.exec(code.slice(start))
  if (parse) return closing(code, start + parse[0].length - 1)
  return -1
}

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])(?:JSON\s*\.\s*parse\s*\(|(?:await\s+)?[\w$.]+\s*\.\s*json\s*\(\s*\))/g)) {
      if (!f.ts) continue
      const start = f.match.index
      const end = sourceEnd(f.code, start)
      if (end < 0) continue
      const after = /^\s*\)?\s*as\s+([\w$]+)/.exec(f.code.slice(end, end + 80))
      const before = /(?:const|let|var)\s+[\w$]+\s*:\s*([^=;]+?)\s*=\s*(?:\(\s*)?$/.exec(f.code.slice(Math.max(0, start - 120), start))
      const type = after?.[1] || before?.[1]
      if (!type || UNTYPED.test(type) || type === 'const') continue
      ctx.report(ctx.lineOf(f.index), `This data is typed as ${type.trim()} without a check; validate it with a schema or a type guard.`)
    }
  }
}
