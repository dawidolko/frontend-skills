/*
 * responsive/dynamic-viewport-units: reports height, min-height and max-height of 100vh when the same rule does not
 * also set the property in dvh, svh or lvh, and Tailwind's h-screen and min-h-screen without a dvh or svh class.
 */
import { classTokens } from '../../../engine/helpers.mjs'

const PROPS = new Set(['height', 'min-height', 'max-height', 'block-size', 'min-block-size'])

export default {
  check(ctx) {
    for (const block of ctx.css()) {
      for (const d of block.decls) {
        if (!PROPS.has(d.prop) || !/\b100vh\b/.test(d.value)) continue
        if (block.decls.some((o) => o.prop === d.prop && /\b\d+(dvh|svh|lvh)\b/.test(o.value))) continue
        ctx.report(d.line, `${d.prop}: 100vh is taller than the visible area on mobile; use 100dvh or 100svh.`)
      }
    }
    if (['css', 'scss', 'less'].includes(ctx.kind)) return
    for (const el of ctx.elements()) {
      const cls = classTokens(el)
      const screen = cls.find((c) => /(^|:)(min-|max-)?h-screen$/.test(c))
      if (screen && !cls.some((c) => /(^|:)(min-|max-)?h-(dvh|svh|lvh)$/.test(c)))
        ctx.report(el, `${screen} is 100vh; use ${screen.replace('screen', 'dvh')} or ${screen.replace('screen', 'svh')}.`)
    }
  }
}
