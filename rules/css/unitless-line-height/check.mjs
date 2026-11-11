/*
 * css/unitless-line-height: reports line-height set as a length or percentage (px, rem, em, %, pt), and the same
 * value after the slash of the font shorthand. When the block (or the shorthand) also sets font-size in px, the message gives the
 * unitless ratio to use instead.
 */
const UNIT = /^(-?\d*\.?\d+)(px|rem|em|%|pt)$/
const SHORTHAND = /\/\s*(\d*\.?\d+(?:px|rem|em|%|pt))\b/

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      const size = b.decls.find((d) => d.prop === 'font-size' && /^\d*\.?\d+px$/.test(d.value))
      for (const d of b.decls) {
        const raw = d.prop === 'line-height' ? d.value : d.prop === 'font' ? SHORTHAND.exec(d.value)?.[1] : null
        const m = raw && UNIT.exec(raw)
        if (!m) continue
        let hint = 'a unitless number such as 1.5'
        const px = d.prop === 'font' ? /(\d*\.?\d+)px\s*\//.exec(d.value)?.[1] : size && Number.parseFloat(size.value)
        if (m[2] === 'px' && px) hint = `${Math.round((Number(m[1]) / Number(px)) * 100) / 100} (${m[1]}px ÷ ${px}px)`
        else if (m[2] === 'em') hint = m[1]
        else if (m[2] === '%') hint = String(Number(m[1]) / 100)
        ctx.report(d.line, `line-height ${raw} does not scale with each element's font size; use ${hint}.`)
      }
    }
  }
}
