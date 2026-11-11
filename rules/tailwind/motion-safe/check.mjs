/*
 * tailwind/motion-safe: reports an animate-* class (other than animate-spin and animate-none) used without a
 * motion-safe: variant when the same element has no motion-reduce: class.
 */
import { literalClasses, splitClass } from '../tw.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const cls = literalClasses(el)
      if (!cls) continue
      const parts = cls.map(splitClass)
      if (parts.some((p) => /motion-reduce:/.test(p.variants))) continue
      const bad = parts.find((p) => /^animate-(?!spin$|none$)/.test(p.utility) && !/motion-safe:/.test(p.variants))
      if (bad) ctx.report(el, `${bad.variants}${bad.utility} ignores reduced motion; write motion-safe:${bad.utility} or add motion-reduce:animate-none.`)
    }
  }
}
