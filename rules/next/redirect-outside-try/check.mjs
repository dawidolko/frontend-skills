/*
 * next/redirect-outside-try: in a file that imports redirect, permanentRedirect, notFound, forbidden or
 * unauthorized from next/navigation, reports a call of one of them inside a try block whose catch does not pass the
 * error on (unstable_rethrow, isRedirectError, or a throw). A try with only finally is left out.
 */
import { closing, findInCode } from '../../js/source.mjs'

const NAMES = ['redirect', 'permanentRedirect', 'notFound', 'forbidden', 'unauthorized']

function imported(text) {
  const out = new Set()
  const re = /import\s*\{([^}]*)\}\s*from\s*["']next\/navigation["']/g
  let m
  while ((m = re.exec(text)))
    for (const part of m[1].split(',')) {
      const [orig, local] = part.trim().split(/\s+as\s+/)
      if (NAMES.includes(orig)) out.add((local || orig).trim())
    }
  return out
}

export default {
  check(ctx) {
    const names = imported(ctx.text)
    if (!names.size) return
    const call = new RegExp(`(?<![\\w$.])(${[...names].join('|')})\\s*\\(`, 'g')
    for (const f of findInCode(ctx, /\btry\s*\{/g)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const after = /^\s*catch\s*(?:\([^)]*\))?\s*\{/.exec(f.code.slice(end))
      if (!after) continue
      const cOpen = end + after[0].length - 1
      const cEnd = closing(f.code, cOpen)
      const handler = f.code.slice(cOpen, cEnd < 0 ? undefined : cEnd)
      if (/\bunstable_rethrow\s*\(|\bisRedirectError\b|\bisNotFoundError\b|\bthrow\b/.test(handler)) continue
      const block = f.code.slice(open, end)
      call.lastIndex = 0
      let m
      while ((m = call.exec(block)))
        ctx.report(ctx.lineOf(f.offset + open + m.index), `${m[1]}() inside try is caught by the catch below; call it after the try/catch.`)
    }
  }
}
