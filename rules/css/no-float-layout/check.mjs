/*
 * css/no-float-layout: reports float used to build columns (a float in a rule that also sets a percentage width, or
 * whose selector names a column, row, grid, sidebar or layout part) and the clearfix rules that exist only to contain
 * such floats. A float that wraps text around an image or a pull quote is left alone.
 */
const LAYOUT_SELECTOR = /(^|[\s.#_-])(col|cols|column|columns|row|grid|sidebar|layout|main|aside)([\s.:_-]|$)/i

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      if (b.atRule) continue
      const fl = b.decls.find((d) => d.prop === 'float' && /^(left|right|inline-start|inline-end)$/.test(d.value))
      if (fl) {
        const pct = b.decls.some((d) => /^(width|flex-basis|inline-size)$/.test(d.prop) && /^\d*\.?\d+%$/.test(d.value))
        if (pct || LAYOUT_SELECTOR.test(b.prelude)) ctx.report(fl.line, `float builds a layout column in "${b.prelude}"; use display: grid or flex with gap.`)
      }
      if (/::?after/.test(b.prelude) && b.decls.some((d) => d.prop === 'clear' && d.value === 'both') && b.decls.some((d) => d.prop === 'content'))
        ctx.report(b.line, `"${b.prelude}" is a clearfix; a grid or flex parent (or display: flow-root) needs none.`)
    }
  }
}
