/*
 * css/animate-composited: reports transitions that list a layout property (width, height, top, left, right,
 * bottom, inset, margin, padding) and @keyframes whose steps change one, because each frame then re-runs layout
 * and paint. transition: all and properties the compositor handles (transform, translate, scale, rotate, opacity,
 * filter) are not reported.
 */
const LAYOUT = /^(width|height|min-width|min-height|inline-size|block-size|top|left|right|bottom|inset(-[a-z-]+)?|margin(-[a-z-]+)?|padding(-[a-z-]+)?)$/

export default {
  check(ctx) {
    const keyframesSeen = new Set()
    for (const b of ctx.css()) {
      for (const d of b.decls) {
        if (d.prop !== 'transition' && d.prop !== 'transition-property') continue
        const props = d.value.split(',').map((part) => part.trim().split(/\s+/)[0])
        const bad = props.find((p) => LAYOUT.test(p))
        if (bad) ctx.report(d.line, `Transitioning ${bad} re-runs layout on every frame; animate transform (translate, scale) or opacity instead.`)
      }
      const kf = b.parents.find((p) => /^@(-\w+-)?keyframes\b/.test(p))
      if (!kf || keyframesSeen.has(kf)) continue
      const d = b.decls.find((x) => LAYOUT.test(x.prop))
      if (d) {
        keyframesSeen.add(kf)
        ctx.report(d.line, `${kf} animates ${d.prop}, which re-runs layout on every frame; use transform or opacity.`)
      }
    }
  }
}
