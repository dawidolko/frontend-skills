/*
 * a11y/iframe-title: reports an <iframe> with no title (or an empty one) and no aria-label or aria-labelledby.
 * Iframes inside <noscript>, hidden with the hidden attribute, aria-hidden="true" or an inline display:none, and
 * iframes with a spread are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('iframe')) {
      if (el.spread || el.ancestors.includes('noscript') || el.attrs.has('hidden')) continue
      if (literal(el.attrs.get('aria-hidden')) === 'true') continue
      if (/display\s*:\s*none/i.test(literal(el.attrs.get('style')) || '')) continue
      if (el.attrs.has('aria-label') || el.attrs.has('aria-labelledby')) continue
      const title = el.attrs.get('title')
      if (title && (title.dynamic || title.value.trim())) continue
      ctx.report(el, '<iframe> has no title; describe its content, for example title="Map of our office".')
    }
  }
}
