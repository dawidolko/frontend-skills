/*
 * css/design-tokens: a project-level check over every stylesheet and component <style> block. When the project
 * defines a token (custom property, Sass or Less variable) whose value is exactly a colour or a spacing length, a
 * declaration that repeats that literal is reported with the token to use. When no token exists, a colour literal
 * written three or more times across the project is reported once, at its first use. Only global tokens count
 * (see styles.mjs), a Sass or Less variable is offered only in a file that can use it, and when several tokens share
 * the value all of them are named. Token definitions, @font-face and forced-colors blocks are skipped.
 */
import { collectTokens, coloursIn, normColour, SPACING_PROPS, styleSources, SPACE_NAME, toPx, usableIn } from './styles.mjs'

const REPEATS = 3

export default {
  check(ctx) {
    const sources = styleSources(ctx)
    const tokens = collectTokens(sources)
    const colourTokens = new Map()
    const spaceTokens = new Map()
    const add = (map, key, t) => map.set(key, [...(map.get(key) || []), t])
    for (const t of tokens) {
      const c = normColour(t.value)
      if (c) add(colourTokens, c, t)
      const px = SPACE_NAME.test(t.name) ? toPx(t.value) : null
      if (px) add(spaceTokens, px, t)
    }
    const name = (list, kind) => {
      const refs = [...new Set(list.filter((t) => usableIn(t, kind)).map((t) => t.ref))]
      if (refs.length === 0) return null
      return refs.length === 1 ? `the value of ${refs[0]}; use the token` : `the value of ${refs.slice(0, 3).join(', ')}; use the one meant for this role`
    }
    const seen = new Map()
    for (const src of sources)
      for (const b of src.blocks) {
        if (b.atRule === 'font-face' || [...b.parents, b.prelude].some((p) => /forced-colors/.test(p))) continue
        for (const d of b.decls) {
          if (d.prop.startsWith('--') || d.prop.startsWith('$') || d.prop.startsWith('@')) continue
          const at = { file: src.file, line: d.line }
          const colours = coloursIn(d.value)
          const hit = colours.find((c) => colourTokens.has(c) && name(colourTokens.get(c), src.kind))
          if (hit) {
            ctx.report(at, `${hit} is ${name(colourTokens.get(hit), src.kind)}.`)
            continue
          }
          for (const c of colours) {
            if (!seen.has(c)) seen.set(c, [])
            seen.get(c).push(at)
          }
          if (SPACING_PROPS.test(d.prop) && !d.value.includes('(')) {
            const len = d.value.split(/\s+/).find((p) => {
              const px = toPx(p)
              return px !== null && spaceTokens.has(Math.abs(px)) && name(spaceTokens.get(Math.abs(px)), src.kind)
            })
            if (len) ctx.report(at, `${d.prop}: ${len} is ${name(spaceTokens.get(Math.abs(toPx(len))), src.kind)}.`)
          }
        }
      }
    for (const [c, uses] of seen)
      if (uses.length >= REPEATS) ctx.report(uses[0], `${c} is written ${uses.length} times; define it once as a token (a custom property such as --color-…) and use var().`)
  }
}
