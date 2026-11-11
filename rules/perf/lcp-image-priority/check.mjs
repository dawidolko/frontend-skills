/*
 * perf/lcp-image-priority: reports an image that is probably the largest contentful paint but is lazy-loaded:
 * an <img> (or an Image, Picture, NuxtImg or NuxtPicture component) marked as the priority image (fetchpriority="high",
 * priority or preload) that also has loading="lazy", and the first <img> of a whole HTML document when it has
 * loading="lazy". Which image is the LCP is only certain on a rendered page; audit --url confirms it.
 */
import { isDocument, literal } from '../../../engine/helpers.mjs'

const IMAGE_COMPONENT = /^(Image|Picture|NuxtImg|NuxtPicture|Img)$/
const lazy = (el) => (literal(el.attrs.get('loading')) || '').toLowerCase() === 'lazy'
const marked = (el) =>
  (literal(el.attrs.get('fetchpriority')) || '').toLowerCase() === 'high' ||
  (el.attrs.has('priority') && literal(el.attrs.get('priority')) !== 'false') ||
  (el.attrs.has('preload') && literal(el.attrs.get('preload')) !== 'false')

export default {
  check(ctx) {
    const images = ctx.elements().filter((el) => (!el.component && el.name === 'img') || (el.component && IMAGE_COMPONENT.test(el.name)))
    for (const el of images)
      if (lazy(el) && marked(el)) ctx.report(el, 'This image is marked as the priority (LCP) image but is lazy-loaded; remove loading="lazy".')
    if (!isDocument(ctx)) return
    const first = images.find((el) => !el.component && !el.ancestors.includes('noscript') && !el.ancestors.includes('template'))
    if (first && lazy(first) && !marked(first))
      ctx.report(
        first,
        'The first image of the page is probably in view and may be the LCP element; do not lazy-load it, and add fetchpriority="high" if it is the hero.'
      )
  }
}
