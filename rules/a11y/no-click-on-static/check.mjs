/*
 * a11y/no-click-on-static: reports a non-interactive element (div, span, li, img and similar) that has a click or
 * mouse-down handler but lacks a role, a tabindex or a keyboard handler. Elements with a spread are skipped.
 */
const STATIC = new Set([
  'div', 'span', 'p', 'li', 'ul', 'ol', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'td', 'tr',
  'th', 'img', 'i', 'b', 'strong', 'em', 'svg', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dt', 'dd', 'label'
])

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component || !STATIC.has(el.name) || el.spread) continue
      if (el.name === 'label') continue
      const has = (n) => el.attrs.has(n)
      if (!has('onclick') && !has('onmousedown')) continue
      const missing = []
      if (!has('role')) missing.push('role')
      if (!has('tabindex')) missing.push('tabindex')
      if (!has('onkeydown') && !has('onkeyup') && !has('onkeypress')) missing.push('a key handler')
      if (missing.length) ctx.report(el, `<${el.name}> has a click handler but no ${missing.join(', ')}; use a <button> or <a>.`)
    }
  }
}
