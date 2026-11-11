/*
 * tailwind/theme-tokens: reports an arbitrary colour or length value (bg-[#0a7a3e], text-[rgb(...)], p-[18px])
 * that appears three or more times in one file, once, at its first use. Arbitrary properties ([mask-type:luminance]),
 * CSS variables (bg-(--brand)) and values used once or twice are left out.
 */
import { literalClasses, splitClass } from '../tw.mjs'

const ARBITRARY = /^-?[a-z][\w-]*-\[((?:#[0-9a-f]{3,8})|(?:(?:rgb|rgba|hsl|hsla|oklch|oklab)\([^\]]*\))|(?:-?\d*\.?\d+(?:px|rem|em|%)))\]$/i
const MIN = 3

export default {
  check(ctx) {
    const seen = new Map()
    for (const el of ctx.elements()) {
      const cls = literalClasses(el)
      if (!cls) continue
      for (const c of cls) {
        const m = ARBITRARY.exec(splitClass(c).utility)
        if (!m) continue
        const value = m[1].toLowerCase()
        if (!seen.has(value)) seen.set(value, { count: 0, line: el.line })
        seen.get(value).count++
      }
    }
    for (const [value, { count, line }] of seen)
      if (count >= MIN) ctx.report(line, `The arbitrary value [${value}] is used ${count} times in this file; define it once in @theme and use the generated utility.`)
  }
}
