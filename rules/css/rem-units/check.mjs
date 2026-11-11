/*
 * css/rem-units: reports font-size written in px, in projects without a px-to-rem helper. When the profile records
 * a rem function (helper "rem-function", reported by css/rem-helper) or a build step that converts px to rem
 * ("px-to-rem-build", where px in the source is the convention), the rule stays silent.
 */
export default {
  check(ctx) {
    const helpers = ctx.helpers || ctx.profile?.helpers || {}
    if (helpers['rem-function'] || helpers['px-to-rem-build']) return
    for (const b of ctx.css())
      for (const d of b.decls) {
        if (d.prop !== 'font-size') continue
        const m = /(?:^|[\s(,])(\d*\.?\d+)px\b/.exec(d.value)
        if (!m) continue
        const rem = `${Math.round((Number(m[1]) / 16) * 10000) / 10000}rem`
        const fix = /^\d*\.?\d+px$/.test(d.value) ? `write ${rem}` : `write its px parts in rem (${m[1]}px = ${rem})`
        ctx.report(d.line, `font-size: ${d.value} is in px and ignores the reader's text size; ${fix}.`)
      }
  }
}
