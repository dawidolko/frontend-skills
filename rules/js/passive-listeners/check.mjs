/*
 * js/passive-listeners: reports addEventListener('touchstart' | 'touchmove' | 'wheel' | 'mousewheel', handler) on an
 * element with no options argument, when the handler does not call preventDefault. The handler is read when it is
 * written inline or is a function declared in the same file; a handler that cannot be found is left out, and so are
 * window, document and body, where these events are passive by default.
 */
import { closing, findInRaw, splitArgs } from '../source.mjs'

const ROOTS = /(?:^|[^\w$.])(?:window|document|self|globalThis|document\s*\.\s*(?:body|documentElement))\s*$/

function handlerBody(raw, code, name) {
  const decl = new RegExp(`(?:function\\s+${name}\\s*\\(|(?:const|let|var)\\s+${name}\\s*=)`).exec(code)
  if (!decl) return null
  const open = code.indexOf('{', decl.index)
  if (open < 0) return null
  const end = closing(code, open)
  return end > 0 ? raw.slice(decl.index, end) : null
}

export default {
  check(ctx) {
    for (const f of findInRaw(ctx, /\.\s*addEventListener\s*\(\s*(["'])(touchstart|touchmove|wheel|mousewheel)\1/g)) {
      if (ROOTS.test(f.code.slice(Math.max(0, f.at - 40), f.at))) continue
      const open = f.code.indexOf('(', f.at)
      const end = closing(f.code, open)
      if (end < 0) continue
      const args = splitArgs(f.code, open, end)
      if (args.length !== 2) continue
      const handler = f.raw.slice(args[1].start, args[1].end).trim()
      const body = /^[\w$]+$/.test(handler) ? handlerBody(f.raw, f.code, handler) : handler
      if (body === null || /preventDefault/.test(body)) continue
      ctx.report(ctx.lineOf(f.index), `Add { passive: true } to this ${f.match[2]} listener; it never calls preventDefault().`)
    }
  }
}
