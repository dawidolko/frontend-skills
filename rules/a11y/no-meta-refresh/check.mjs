/*
 * a11y/no-meta-refresh: reports <meta http-equiv="refresh"> whose content starts with a delay above 0 seconds, which
 * reloads or redirects the page on a timer. An immediate redirect (content="0; url=…") is accepted.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('meta')) {
      if ((literal(el.attrs.get('http-equiv')) || '').trim().toLowerCase() !== 'refresh') continue
      const content = literal(el.attrs.get('content'))
      const m = content === null ? null : /^\s*(\d+(?:\.\d+)?)/.exec(content)
      if (m && Number(m[1]) > 0) ctx.report(el, `<meta http-equiv="refresh" content="${content.trim()}"> changes the page after ${m[1]} s; redirect on the server or let people choose.`)
    }
  }
}
