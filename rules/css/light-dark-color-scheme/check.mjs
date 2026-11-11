/*
 * css/light-dark-color-scheme: a project-level check. When a stylesheet uses light-dark(), it reports the first use
 * if nothing in the project declares a colour scheme: no color-scheme property in any style, no
 * <meta name="color-scheme"> in markup and no colorScheme in a framework's metadata or viewport export.
 */
import { styleSources } from '../design-tokens/styles.mjs'

export default {
  check(ctx) {
    const sources = styleSources(ctx)
    let first = null
    for (const src of sources)
      for (const b of src.blocks)
        for (const d of b.decls) {
          if (d.prop === 'color-scheme') return
          if (!first && /\blight-dark\(/.test(d.value)) first = { file: src.file, line: d.line }
        }
    if (!first) return
    for (const f of ctx.files) {
      if (!['html', 'jsx', 'vue', 'svelte', 'astro', 'angular'].includes(f.kind)) continue
      const text = ctx.read(f.path)
      if (/name=["']color-scheme["']|\bcolorScheme\s*:/.test(text)) return
    }
    ctx.report(first, 'light-dark() picks a value only when the element has a color-scheme; add color-scheme: light dark on :root.')
  }
}
