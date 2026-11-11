/*
 * css/limited-needs-supports: reports the first declaration in a rule that uses anchor positioning (not Baseline
 * on 2026-11-11) or scroll-driven animation timelines (Baseline only since 2026-10-27) when the rule is not inside
 * an @supports block. Without support these declarations are dropped, so the element needs a working fallback.
 */
const PROP = /^(anchor-name|position-anchor|position-area|position-try(-fallbacks|-order)?|position-visibility|animation-timeline|scroll-timeline(-name|-axis)?|view-timeline(-name|-axis|-inset)?|animation-range(-start|-end)?)$/
const VALUE = /\banchor(-size)?\(/

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      if ([...b.parents, b.prelude].some((p) => p.startsWith('@supports'))) continue
      const d = b.decls.find((x) => PROP.test(x.prop) || VALUE.test(x.value))
      if (d) ctx.report(d.line, `${d.prop} is not supported in every current browser; put it in @supports and keep a working fallback outside.`)
    }
  }
}
