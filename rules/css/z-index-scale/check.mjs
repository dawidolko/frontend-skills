/*
 * css/z-index-scale: a project-level check. When the project defines a z-index scale (tokens named z-…, zindex-…,
 * layer-… or a Sass map such as $z-layers), every literal z-index of 10 or more is reported with the scale
 * to use. Without a scale, literal values of 100 or more (the 999 and 9999 of an escalation) are reported.
 */
import { collectTokens, styleSources } from '../design-tokens/styles.mjs'

const Z_NAME = /^(z|zindex|z-index|layer|layers|elevation)([-_]|$)/i

export default {
  check(ctx) {
    const sources = styleSources(ctx)
    const scale = collectTokens(sources).filter((t) => Z_NAME.test(t.name))
    const names = scale.slice(0, 3).map((t) => t.ref).join(', ')
    for (const src of sources)
      for (const b of src.blocks)
        for (const d of b.decls) {
          if (d.prop !== 'z-index' || !/^-?\d+$/.test(d.value)) continue
          const n = Number(d.value)
          const at = { file: src.file, line: d.line }
          if (scale.length && Math.abs(n) >= 10) ctx.report(at, `z-index: ${n} is not from the project's scale; use one of its layers (${names}).`)
          else if (!scale.length && Math.abs(n) >= 100) ctx.report(at, `z-index: ${n} is an ad hoc number; define a z-index scale (--z-dropdown, --z-modal, --z-toast) and use it.`)
        }
  }
}
