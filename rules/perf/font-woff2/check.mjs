/*
 * perf/font-woff2: reports an @font-face whose src offers no WOFF2 file but does load TTF, OTF, EOT, SVG or WOFF
 * files, which are larger for the same font. A src made only of local() fonts is left alone.
 */
export default {
  check(ctx) {
    for (const b of ctx.css()) {
      if (b.atRule !== 'font-face') continue
      const src = b.decls.filter((d) => d.prop === 'src').map((d) => d.value).join(',')
      if (!/url\(/.test(src) || /\.woff2\b|format\(\s*['"]?woff2/i.test(src)) continue
      const old = /\.(ttf|otf|eot|svg|woff)\b/i.exec(src)
      if (old) ctx.report(b.line, `@font-face loads a .${old[1].toLowerCase()} file with no WOFF2; convert the font to WOFF2 and list only that.`)
    }
  }
}
