/*
 * html/doctype: reports an HTML file that contains an <html> element but no doctype.
 */
export default {
  check(ctx) {
    const html = ctx.elements('html')[0]
    if (html && !ctx.doctype) ctx.report(html, 'The document has no <!doctype html> and renders in quirks mode.')
  }
}
