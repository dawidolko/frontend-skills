/*
 * tailwind/hover-only-reveal: reports an element whose classes hide it (opacity-0, invisible, hidden, sr-only) and
 * show it again only under a hover variant (hover:, group-hover:, peer-hover:), with no focus variant (focus:,
 * focus-visible:, focus-within: and their group- and peer- forms) on the same element.
 */
import { literalClasses, splitClass } from '../tw.mjs'

const HIDES = new Set(['opacity-0', 'invisible', 'hidden', 'sr-only'])
const SHOWS = /^(?:opacity-100|visible|block|flex|inline|inline-block|inline-flex|grid|not-sr-only)$/

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const cls = literalClasses(el)
      if (!cls || !cls.some((c) => HIDES.has(c))) continue
      const parts = cls.map(splitClass)
      const hoverShow = parts.find((p) => /(?:^|:)(?:group-|peer-)?hover(?:\/[\w-]+)?:$/.test(p.variants) && SHOWS.test(p.utility))
      if (!hoverShow) continue
      if (parts.some((p) => /focus/.test(p.variants))) continue
      ctx.report(el, `"${hoverShow.variants}${hoverShow.utility}" reveals this only on hover; add the matching focus-within: or focus-visible: class.`)
    }
  }
}
