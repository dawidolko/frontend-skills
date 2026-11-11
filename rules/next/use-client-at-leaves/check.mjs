/*
 * next/use-client-at-leaves: reports a 'use client' directive at the top of an App Router page or layout. A file
 * counts as one when its path is app/.../page or layout, or (for files outside a recognisable path) when its default
 * export is a function named Page, Layout or RootLayout, the names the Next.js docs use for route files.
 */
const DIRECTIVE = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*(["'])use client\1/
const ROUTE_PATH = /(?:^|\/)app\/(?:.*\/)?(?:page|layout)\.[jt]sx?$/
const ROUTE_NAME = /export\s+default\s+(?:async\s+)?function\s+(?:Page|Layout|RootLayout)\s*\(/

export default {
  check(ctx) {
    const m = DIRECTIVE.exec(ctx.text)
    if (!m) return
    if (/(?:^|\/)pages\//.test(ctx.file)) return
    if (!ROUTE_PATH.test(ctx.file) && !ROUTE_NAME.test(ctx.text)) return
    ctx.report(ctx.lineOf(m.index + m[0].length - 1), "'use client' on a page or layout ships the whole route to the browser; move it to the interactive child component.")
  }
}
