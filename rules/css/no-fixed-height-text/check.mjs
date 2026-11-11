/*
 * css/no-fixed-height-text: reports a rule that fixes height (or block-size) to a length and hides overflow, so
 * enlarged text or the person's own text spacing is clipped. Square or fixed-size boxes (a width is fixed too),
 * media selectors (img, video, svg, avatar, icon, logo), line-clamp blocks, heights under 24px (bars and rules
 * that hold no text) and heights in %, vh or variables are left alone.
 */
const LENGTH = /^\d*\.?\d+(px|rem|em|pt)$/
const toPx = (v) => Number.parseFloat(v) * (/px$/.test(v) ? 1 : /pt$/.test(v) ? 4 / 3 : 16)
const MEDIA = /(^|[\s.#_-])(img|video|svg|canvas|iframe|picture|avatar|icon|logo|thumb|thumbnail|image|media)([\s.:_-]|$)/i

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      if (b.atRule || MEDIA.test(b.prelude)) continue
      const h = b.decls.find((d) => (d.prop === 'height' || d.prop === 'block-size') && LENGTH.test(d.value) && toPx(d.value) >= 24)
      if (!h) continue
      const hidden = b.decls.some((d) => /^overflow(-y|-block)?$/.test(d.prop) && /\b(hidden|clip)\b/.test(d.value))
      const fixedWidth = b.decls.some((d) => (d.prop === 'width' || d.prop === 'inline-size') && LENGTH.test(d.value))
      const clamp = b.decls.some((d) => /line-clamp$/.test(d.prop))
      if (hidden && !fixedWidth && !clamp)
        ctx.report(
          h.line,
          `${h.prop}: ${h.value} with hidden overflow clips text when it is enlarged or spaced; use min-height and let the content set the height.`
        )
    }
  }
}
