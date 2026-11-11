/*
 * sass/rem-helper: in a project whose profile records a px-to-rem function (helper "rem-function"), reports sizes
 * converted by hand instead of with that function: math.div(24px, $base) * 1rem, (24 / 16) * 1rem, #{24 / 16}rem,
 * calc(24rem / 16), 24 / $base * 1rem. The bodies of @function definitions (the helper itself) are left out, and so
 * is a declaration that css/rem-helper already reports for a raw px value, so no line is reported twice. Skipped
 * when a build step converts px to rem (helper "px-to-rem-build").
 */
import { findInScss, functionRanges } from '../scss.mjs'

const N = '-?[\\d.]+(?:px)?'
const PATTERNS = [
  new RegExp(`math\\.div\\(\\s*${N}\\s*,[^()]*\\)\\s*\\*\\s*1rem|1rem\\s*\\*\\s*math\\.div\\(\\s*${N}\\s*,`, 'g'),
  new RegExp(`\\(\\s*${N}\\s*\\/\\s*[\\w$.-]+\\s*\\)\\s*\\*\\s*1rem|1rem\\s*\\*\\s*\\(\\s*${N}\\s*\\/`, 'g'),
  new RegExp(`#\\{\\s*(?:${N}\\s*\\/[^}]*|math\\.div\\(\\s*${N}[^}]*)\\}rem`, 'g'),
  new RegExp(`calc\\(\\s*${N}(?:rem)?\\s*\\/\\s*[\\d.]+(?:px)?(?:\\s*\\*\\s*1rem)?\\s*\\)`, 'g'),
  new RegExp(`(?<![\\w.$(-])${N}\\s*\\/\\s*(?:16|\\$[\\w-]*(?:base|root|font-size)[\\w-]*)(?:px)?\\s*\\*\\s*1rem`, 'g')
]
/* The declarations css/rem-helper reads, and its test for a raw px value. */
const CSS_RULE_PROPS = /^(font-size|padding(-[a-z-]+)?|margin(-[a-z-]+)?|gap|row-gap|column-gap)$/
const RAW_PX = /(?<![\w.(-])(\d*\.?\d+)px\b/g

function reportedByCssRule(ctx, name) {
  const lines = new Set()
  for (const block of ctx.css())
    for (const d of block.decls)
      if (CSS_RULE_PROPS.test(d.prop) && !d.value.includes(`${name}(`) && [...d.value.matchAll(RAW_PX)].some((m) => Number(m[1]) >= 2)) lines.add(d.line)
  return lines
}

export default {
  check(ctx) {
    if (ctx.helpers['px-to-rem-build']) return
    const name = ctx.helpers['rem-function'].name
    const lines = reportedByCssRule(ctx, name)
    for (const re of PATTERNS)
      for (const f of findInScss(ctx, re, { strings: true })) {
        if (!/rem/.test(f.match[0])) continue
        if (functionRanges(f.code).some((r) => f.at >= r.start && f.at < r.end)) continue
        const line = ctx.lineOf(f.index)
        if (lines.has(line)) continue
        lines.add(line)
        const px = /^-?[\d.]+/.exec(f.match[0].replace(/^[^\d-]*/, ''))?.[0]
        ctx.report(line, `Convert with the project's helper, ${name}(${px ? `${px}px` : '...'}), instead of dividing by hand.`)
      }
  }
}
