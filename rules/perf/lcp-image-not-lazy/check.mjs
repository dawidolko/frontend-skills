/*
 * perf/lcp-image-not-lazy: reports an <img> with loading="lazy" that is marked as the main image of the page:
 * fetchpriority="high", Angular's priority attribute, or a hero, banner, masthead or cover class. Which image is
 * the LCP element is only known in the browser, so other lazy images are left to perf/lcp-image.
 */
import { classTokens, literal } from '../../../engine/helpers.mjs'

const HERO = /(^|[-_])(hero|banner|masthead|cover|lcp)([-_]|$)/i

export default {
  check(ctx) {
    for (const el of ctx.elements('img')) {
      if (el.spread || (literal(el.attrs.get('loading')) || '').toLowerCase() !== 'lazy') continue
      const high = (literal(el.attrs.get('fetchpriority')) || '').toLowerCase() === 'high' || el.attrs.has('priority')
      const hero = classTokens(el).some((t) => HERO.test(t))
      if (high) ctx.report(el, '<img> is marked high priority and loading="lazy"; remove loading="lazy" from the main image.')
      else if (hero) ctx.report(el, '<img> looks like the hero image and has loading="lazy"; load it eagerly with fetchpriority="high".')
    }
  }
}
