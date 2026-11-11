/*
 * css/rem-helper: in projects whose profile records a px-to-rem Sass or Less function (helper "rem-function"),
 * reports font sizes, padding, margin and gaps written in px (2px and more) without that function. Skipped when a
 * build step converts px to rem (helper "px-to-rem-build") and in plain .css files, where a Sass function cannot run.
 */
const PROPS = /^(font-size|padding(-[a-z-]+)?|margin(-[a-z-]+)?|gap|row-gap|column-gap|padding-inline|padding-block|margin-inline|margin-block)$/

export default {
  check(ctx) {
    if (ctx.helpers['px-to-rem-build'] || ctx.kind === 'css') return
    const name = ctx.helpers['rem-function'].name
    for (const block of ctx.css())
      for (const d of block.decls) {
        if (!PROPS.test(d.prop) || d.value.includes(`${name}(`)) continue
        const px = [...d.value.matchAll(/(?<![\w.(-])(\d*\.?\d+)px\b/g)].map((m) => Number(m[1])).filter((n) => n >= 2)
        if (px.length) ctx.report(d.line, `${d.prop}: ${d.value} uses px; write ${name}(${px[0]}px) like the rest of the project.`)
      }
  }
}
