/*
 * css/design-tokens: a project-level check over every stylesheet and component <style> block. When the project
 * defines a token (custom property, Sass or Less variable) whose value is exactly a colour or a spacing length, a
 * declaration that repeats that literal is reported with the token to use. When no token exists, a colour literal
 * written three or more times across the project is reported once, at its first use. Token definitions themselves,
 * @font-face and forced-colors blocks are skipped.
 */
import { collectTokens, coloursIn, normColour, SPACING_PROPS, spacingScale, styleSources, toPx } from './styles.mjs'

const REPEATS = 3

export default {
  check(ctx) {
    const sources = styleSources(ctx)
    const tokens = collectTokens(sources)
    const colourTokens = new Map()
    for (const t of tokens) {
      const c = normColour(t.value)
      if (c && !colourTokens.has(c)) colourTokens.set(c, t)
    }
    const scale = spacingScale(tokens)
    const seen = new Map()
    for (const src of sources)
      for (const b of src.blocks) {
        if (b.atRule === 'font-face' || [...b.parents, b.prelude].some((p) => /forced-colors/.test(p))) continue
        for (const d of b.decls) {
          if (d.prop.startsWith('--') || d.prop.startsWith('$') || d.prop.startsWith('@')) continue
          const at = { file: src.file, line: d.line }
          const colours = coloursIn(d.value)
          const hit = colours.find((c) => colourTokens.has(c))
          if (hit) {
            ctx.report(at, `${hit} is the value of ${colourTokens.get(hit).ref}; use the token.`)
            continue
          }
          for (const c of colours) {
            if (!seen.has(c)) seen.set(c, [])
            seen.get(c).push(at)
          }
          if (SPACING_PROPS.test(d.prop) && !d.value.includes('(')) {
            const len = d.value.split(/\s+/).find((p) => {
              const px = toPx(p)
              return px !== null && scale.has(Math.abs(px))
            })
            if (len) ctx.report(at, `${d.prop}: ${len} is the value of ${scale.get(Math.abs(toPx(len))).ref}; use the token.`)
          }
        }
      }
    for (const [c, uses] of seen)
      if (uses.length >= REPEATS) ctx.report(uses[0], `${c} is written ${uses.length} times; define it once as a token (a custom property such as --color-…) and use var().`)
  }
}
