/*
 * css/reduced-motion: a project-level check. When the project's styles animate (@keyframes with an animation that
 * uses them, scroll-behavior: smooth, scroll-driven timelines), it reports the first one if nothing in the project
 * responds to the reduced-motion setting: no prefers-reduced-motion in styles or scripts, no Tailwind motion-safe:
 * or motion-reduce: classes, no reducedMotion option of an animation library.
 */
import { styleSources } from '../design-tokens/styles.mjs'

const RESPONDS = /prefers-reduced-motion|motion-safe:|motion-reduce:|useReducedMotion|reducedMotion/

export default {
  check(ctx) {
    const sources = styleSources(ctx)
    if (sources.some((s) => RESPONDS.test(s.text))) return
    let first = null
    for (const src of sources) {
      for (const b of src.blocks) {
        const d = b.decls.find(
          (x) =>
            ((x.prop === 'animation' || x.prop === 'animation-name') && !/^(none|initial|inherit|unset)$/.test(x.value)) ||
            (x.prop === 'scroll-behavior' && x.value === 'smooth') ||
            x.prop === 'animation-timeline'
        )
        if (d && !b.parents.some((p) => p.startsWith('@keyframes'))) {
          first = { file: src.file, line: d.line, what: `${d.prop}: ${d.value}` }
          break
        }
      }
      if (first) break
    }
    if (!first) return
    for (const f of ctx.files) if (['jsx', 'vue', 'svelte', 'astro', 'html', 'angular'].includes(f.kind) && RESPONDS.test(ctx.read(f.path))) return
    ctx.report(
      first,
      `${first.what} runs for everyone; nothing in the project honours prefers-reduced-motion. Wrap motion in @media (prefers-reduced-motion: no-preference) or tone it down under reduce.`
    )
  }
}
