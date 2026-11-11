/*
 * responsive/no-fixed-wide-width: reports width, min-width, inline-size or min-inline-size fixed to more than
 * 320 CSS px (or 20rem/em) on a rule that is not inside a min-width media or container query, because the box then
 * forces sideways scrolling on narrow screens and at high zoom. width with a max-width in the same rule, and
 * selectors for tables, code, canvases and carousels (which scroll in their own wrapper), are left alone.
 */
const PROPS = /^(width|min-width|inline-size|min-inline-size)$/
const EXEMPT = /(^|[\s.#_-])(table|pre|code|canvas|carousel|slider|track|scroller|marquee)([\s.:_-]|$)/i
const WIDE_QUERY = /^@(media|container)\b.*(min-width|min-inline-size|width\s*>|inline-size\s*>)/

function px(v) {
  const m = /^(\d*\.?\d+)(px|rem|em)$/.exec(v)
  return m ? Number(m[1]) * (m[2] === 'px' ? 1 : 16) : 0
}

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      if (b.atRule || EXEMPT.test(b.prelude) || b.parents.some((p) => WIDE_QUERY.test(p))) continue
      const capped = b.decls.some((d) => d.prop === 'max-width' || d.prop === 'max-inline-size')
      for (const d of b.decls) {
        if (!PROPS.test(d.prop) || px(d.value) <= 320) continue
        if (capped && !d.prop.startsWith('min-')) continue
        ctx.report(
          d.line,
          `${d.prop}: ${d.value} is wider than a 320px screen and forces sideways scrolling; use max-width: ${d.value} or min(100%, ${d.value}).`
        )
      }
    }
  }
}
