/*
 * security/csp-meta-ignored: reports security settings that browsers ignore when they come from a <meta> element:
 * X-Frame-Options in http-equiv, and the frame-ancestors, report-uri and sandbox directives in a Content-Security-
 * Policy meta tag. They work only as HTTP response headers.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('meta')) {
      const eq = (literal(el.attrs.get('http-equiv')) || '').trim().toLowerCase()
      if (eq === 'x-frame-options') ctx.report(el, 'X-Frame-Options in a meta tag is ignored; send it (or CSP frame-ancestors) as an HTTP header.')
      if (eq !== 'content-security-policy') continue
      const policy = (literal(el.attrs.get('content')) || '').toLowerCase()
      const ignored = ['frame-ancestors', 'report-uri', 'sandbox'].filter((d) => new RegExp(`(^|;)\\s*${d}(\\s|;|$)`).test(policy))
      if (ignored.length) ctx.report(el, `${ignored.join(', ')} in a CSP meta tag ${ignored.length > 1 ? 'are' : 'is'} ignored; send the policy as an HTTP header.`)
    }
  }
}
