/*
 * next/use-next-font: in a Next.js project, reports link elements whose literal href points to the Google Fonts
 * stylesheet (fonts.googleapis.com) and CSS @import rules of that stylesheet. Preconnect hints alone are not
 * reported; the stylesheet they serve is.
 */
const GOOGLE = /^https?:\/\/fonts\.googleapis\.com\//i
const IMPORT = /@import\s+(?:url\(\s*)?["']?https?:\/\/fonts\.googleapis\.com\//gi

export default {
  check(ctx) {
    if (['css', 'scss'].includes(ctx.kind)) {
      IMPORT.lastIndex = 0
      let m
      while ((m = IMPORT.exec(ctx.text))) ctx.report(ctx.lineOf(m.index), 'Load this font with next/font/google instead of @import from fonts.googleapis.com.')
      return
    }
    for (const el of ctx.elements('link')) {
      const href = el.attrs.get('href')
      if (!href || href.dynamic || !GOOGLE.test(href.value)) continue
      if (/preconnect|dns-prefetch/i.test(el.attrs.get('rel')?.value || '')) continue
      ctx.report(el, 'Load this font with next/font/google instead of a <link> to fonts.googleapis.com.')
    }
  }
}
