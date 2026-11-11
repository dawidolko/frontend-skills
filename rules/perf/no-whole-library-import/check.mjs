/*
 * perf/no-whole-library-import: reports imports and requires of the CommonJS "lodash" package (any import pulls in
 * the whole library) and of "moment" (large, with every locale). lodash-es, per-method paths such as lodash/debounce
 * and other libraries are accepted. Comments are ignored.
 */
const RE = /(?:\bimport\s+(?:[\w*{}\s,]+\s+from\s+)?|\brequire\s*\(\s*|\bimport\s*\(\s*)['"](lodash|moment)['"]/g

export default {
  check(ctx) {
    const text = ctx.text
      .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
      .replace(/(^|[^:'"`])\/\/[^\n]*/g, (c, p) => p + ' '.repeat(c.length - p.length))
    for (const m of text.matchAll(RE)) {
      const tip =
        m[1] === 'lodash' ? 'import from lodash-es or use the platform (structuredClone, Array methods)' : 'use Intl.DateTimeFormat or a small date library'
      ctx.report(ctx.lineOf(m.index), `"${m[1]}" ships the whole library to the browser; ${tip}.`)
    }
  }
}
