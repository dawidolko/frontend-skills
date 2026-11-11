/*
 * a11y/font-size-relative: reports a font-size (or the size inside the font shorthand) in px on the html or :root
 * selector. Other selectors are left alone: pixel sizes there still scale with zoom and are a design choice.
 */
const ROOT = /^(html|:root)$/i

export default {
  check(ctx) {
    for (const block of ctx.css()) {
      if (!block.prelude || !block.prelude.split(',').some((p) => ROOT.test(p.trim()))) continue
      for (const d of block.decls) {
        const px = d.prop === 'font-size' ? /^\d+(\.\d+)?px$/i.test(d.value) : d.prop === 'font' && /(^|\s)\d+(\.\d+)?px(\/|\s)/i.test(d.value)
        if (px) ctx.report(d.line, `${block.prelude.trim()} { ${d.prop}: ${d.value} } ignores the reader's default text size; use 100% and rem.`)
      }
    }
  }
}
