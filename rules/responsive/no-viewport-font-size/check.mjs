/*
 * responsive/no-viewport-font-size: reports font-size whose value uses viewport units (vw, vh, vmin, vmax, vi, vb
 * and their s/l/d variants) with no rem, em, px or other zoomable length in it, because browser zoom and the text
 * size setting then cannot enlarge the text. clamp() with rem bounds and calc(1rem + 1vw) are accepted; values
 * that use a variable are skipped.
 */
const VIEWPORT = /\d(?:[sld]?(?:vw|vh|vi|vb)|vmin|vmax)\b/
const ZOOMABLE = /\d(?:rem|em|px|ch|ex|lh|rlh|pt)\b|\d%/

export default {
  check(ctx) {
    for (const b of ctx.css())
      for (const d of b.decls)
        if (d.prop === 'font-size' && VIEWPORT.test(d.value) && !ZOOMABLE.test(d.value) && !d.value.includes('var('))
          ctx.report(d.line, `font-size: ${d.value} uses only viewport units, so zoom cannot enlarge it; use clamp(1rem, 0.9rem + 1vw, 1.5rem) with rem bounds.`)
  }
}
