/*
 * webc/lit-unsafe-html: reports unsafeHTML(...), unsafeSVG(...) and unsafeStatic(...) whose argument is not a
 * plain string literal and not a call to a sanitizer (DOMPurify.sanitize, sanitize, sanitizeHtml).
 */
import { closing, findInCode } from '../../js/source.mjs'

const SAFE = /^\s*(?:(["'])[^]*\1|`[^`$]*`|(?:[\w$]+\.)?sanitize(?:Html)?\s*\()/

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])(unsafeHTML|unsafeSVG|unsafeStatic)\s*\(/g)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const arg = f.raw.slice(open + 1, end - 1).trim()
      if (!arg || (SAFE.test(arg) && !/^["'`].*["'`]\s*\+/.test(arg))) continue
      ctx.report(ctx.lineOf(f.index), `${f.match[1]}() renders its argument as markup; render data as \${text} or sanitize it first.`)
    }
  }
}
