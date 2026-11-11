/*
 * a11y/control-name: reports a <button>, or an <a> with an href, whose content gives it no accessible name: no text,
 * no image with alt text, no svg <title>, and no aria-label, aria-labelledby or title on the control. Icon
 * components (names containing Icon, Svg, Glyph or Logo) count as content without text. The control is skipped when
 * it has a spread, when its content holds an expression, a slot or any other component, because the name may then
 * come from there at run time.
 */
const NAMED = ['aria-label', 'aria-labelledby', 'title']
const CONTENT = ['v-text', 'v-html', 'innertext', 'innerhtml', 'textcontent', 'set:text', 'set:html', 'dangerouslysetinnerhtml', 'children']
const ICON = /icon|svg|glyph|logo/i

/* Index of the ">" that ends the start tag at `start`, skipping quoted values and {…} expressions. */
function openEnd(s, start) {
  let q = null
  let depth = 0
  for (let i = start + 1; i < s.length; i++) {
    const c = s[i]
    if (q) {
      if (c === '\\') i++
      else if (c === q) q = null
    } else if (c === '"' || c === "'" || c === '`') q = c
    else if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth <= 0) return i
  }
  return -1
}

/* Text of a fragment with tags and comments removed; null when it holds an expression. */
function plainText(s, kind) {
  const exprOpen = kind === 'html' || kind === 'vue' || kind === 'angular' ? '{{' : '{'
  let out = ''
  let i = 0
  while (i < s.length) {
    if (s.startsWith('<!--', i)) {
      const e = s.indexOf('-->', i)
      i = e === -1 ? s.length : e + 3
    } else if (s[i] === '<' && /[A-Za-z/]/.test(s[i + 1] || '')) {
      const e = openEnd(s, i)
      i = e === -1 ? s.length : e + 1
    } else if (s.startsWith(exprOpen, i)) return null
    else out += s[i++]
  }
  return out
}

function isInside(el, parent) {
  for (let p = el.parent; p; p = p.parent) if (p === parent) return true
  return false
}

export default {
  check(ctx) {
    const all = ctx.elements()
    for (const el of all) {
      if (el.component || (el.name !== 'button' && el.name !== 'a')) continue
      if (el.name === 'a' && !el.attrs.has('href')) continue
      if (el.spread || [...NAMED, ...CONTENT].some((a) => el.attrs.has(a)) || el.end === undefined) continue
      const s = ctx.text
      const start = openEnd(s, el.index)
      const close = s.lastIndexOf('<', el.end - 1)
      if (start === -1 || close <= start) continue
      const text = plainText(s.slice(start + 1, close), ctx.kind)
      if (text === null || text.replace(/\s+/g, '') !== '') continue
      let named = false
      let unknown = false
      for (const d of all) {
        if (!isInside(d, el)) continue
        if (d.component) {
          if (!ICON.test(d.rawName)) unknown = true
        } else if (['slot', 'ng-content', 'template'].includes(d.name) || d.name.includes('-') || d.spread) unknown = true
        else if (d.attrs.has('aria-label') || d.attrs.has('aria-labelledby')) named = true
        else if (d.name === 'img' && d.attrs.has('alt') && (d.attrs.get('alt').dynamic || d.attrs.get('alt').value.trim())) named = true
        else if (d.name === 'title' && d.parent?.name === 'svg') named = true
      }
      if (named || unknown) continue
      ctx.report(el, `<${el.name}> has no accessible name; add visible text, visually hidden text or aria-label.`)
    }
  }
}
