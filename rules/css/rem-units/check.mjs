/*
 * css/rem-units: reports font-size in px everywhere. When the project has a px-to-rem helper (named in the profile
 * under conventions.remHelper, or already called in the file: rem-calc(24), to-rem(24), px-to-rem(24)…), it also
 * reports px in margin, padding and gap and px breakpoints in @media, and the fix names that helper. Hairlines up
 * to 2px and zero are left alone. In a plain .css file the helper cannot run, so the fix gives the rem value.
 */
const SPACING = /^(margin|padding)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$|^(gap|row-gap|column-gap)$/
const CALL = /\b(rem-calc|to-rem|px-to-rem|pxtorem|px2rem|torem|rem)\(\s*-?\d*\.?\d+(?:px)?\s*\)/

function helperOf(ctx) {
  const named = ctx.profile?.conventions?.remHelper
  if (named?.name) return { name: named.name, base: Number(named.base) || 16 }
  const m = CALL.exec(ctx.text)
  return m ? { name: m[1], base: 16 } : null
}

export default {
  check(ctx) {
    const helper = helperOf(ctx)
    const base = helper?.base || 16
    const canCall = helper && (['scss', 'less'].includes(ctx.kind) || ctx.text.includes(`${helper.name}(`))
    const fix = (px) => (canCall ? `${helper.name}(${px})` : `${Math.round((px / base) * 10000) / 10000}rem`)
    for (const b of ctx.css()) {
      if (helper && b.atRule === 'media') {
        const m = /(\d*\.?\d+)px/.exec(b.prelude)
        if (m) ctx.report(b.line, `The breakpoint ${m[0]} is in px; write ${fix(Number(m[1]))} so it follows the user's font size.`)
      }
      for (const d of b.decls) {
        const isFont = d.prop === 'font-size'
        if (!isFont && !(helper && SPACING.test(d.prop))) continue
        const m = /(?:^|[\s(,])(-?\d*\.?\d+)px\b/.exec(d.value)
        if (!m || (!isFont && Math.abs(Number(m[1])) <= 2)) continue
        const px = Math.abs(Number(m[1]))
        ctx.report(d.line, `${d.prop}: ${m[1]}px is a raw px size; write ${fix(px)}${canCall ? `, the project's helper` : ''}.`)
      }
    }
  }
}
