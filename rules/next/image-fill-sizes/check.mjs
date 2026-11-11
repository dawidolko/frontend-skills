/*
 * next/image-fill-sizes: reports the Image component imported from next/image (under whatever local name) when it
 * has fill and no sizes. Elements with a spread are left out, since sizes may come from it, and so is fill={false}.
 */
export default {
  check(ctx) {
    const m = /import\s+([\w$]+)\s*(?:,\s*\{[^}]*\})?\s*from\s*["']next\/image["']/.exec(ctx.text)
    if (!m) return
    for (const el of ctx.elements()) {
      if (el.rawName !== m[1] || el.spread) continue
      const fill = el.attrs.get('fill')
      if (!fill || (fill.dynamic && fill.value.trim() === 'false') || el.attrs.has('sizes')) continue
      ctx.report(el, `<${m[1]} fill> has no sizes; the browser assumes 100vw and downloads a larger file than the slot needs.`)
    }
  }
}
