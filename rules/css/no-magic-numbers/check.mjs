/*
 * css/no-magic-numbers: a project-level check that runs only when the project has a spacing scale (at least three
 * spacing tokens such as --space-2 or $spacer-3 with a single length value). It reports margin, padding, gap and
 * offset (top, inset…) lengths that are not a step of that scale, naming the nearest step. Zero, hairlines up to 2px,
 * percentages, auto and values computed with a function are left alone; an exact step is css/design-tokens' finding.
 */
import { collectTokens, OFFSET_PROPS, SPACING_PROPS, spacingScale, styleSources, toPx } from '../design-tokens/styles.mjs'

export default {
  check(ctx) {
    const sources = styleSources(ctx)
    const scale = spacingScale(collectTokens(sources))
    if (scale.size < 3) return
    const steps = [...scale.keys()].sort((a, b) => a - b)
    for (const src of sources)
      for (const b of src.blocks)
        for (const d of b.decls) {
          if (!(SPACING_PROPS.test(d.prop) || OFFSET_PROPS.test(d.prop)) || /[($@]/.test(d.value)) continue
          const odd = d.value.split(/\s+/).find((p) => {
            const px = toPx(p)
            return px !== null && Math.abs(px) > 2 && !scale.has(Math.abs(px))
          })
          if (!odd) continue
          const px = Math.abs(toPx(odd))
          const near = steps.reduce((a, s) => (Math.abs(s - px) < Math.abs(a - px) ? s : a), steps[0])
          ctx.report({ file: src.file, line: d.line }, `${d.prop}: ${odd} is not on the spacing scale; use the nearest step ${scale.get(near).ref} (${near}px) or derive it from layout.`)
        }
  }
}
