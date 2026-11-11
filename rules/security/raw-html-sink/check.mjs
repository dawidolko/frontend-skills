/*
 * security/raw-html-sink: reports raw HTML sinks fed with a value that is not a string literal and not passed
 * through a sanitizer: dangerouslySetInnerHTML, v-html, Astro set:html, Svelte {@html}, innerHTML and outerHTML
 * assignments, insertAdjacentHTML, document.write and Angular bypassSecurityTrust* calls. JSON.stringify inside a
 * <script> element (JSON-LD) is left alone. Comments are ignored.
 */

/* The text with line, block and HTML comments blanked (line breaks kept); strings are kept. */
function codeOnly(s) {
  let out = ''
  let i = 0
  const blank = (end) => {
    out += s.slice(i, end).replace(/[^\n]/g, ' ')
    i = end
  }
  const upTo = (token, from, extra) => (s.indexOf(token, from) === -1 ? s.length : s.indexOf(token, from) + extra)
  while (i < s.length) {
    const c = s[i]
    if (c === '/' && s[i + 1] === '/' && s[i - 1] !== ':') blank(upTo('\n', i, 0))
    else if (c === '/' && s[i + 1] === '*') blank(upTo('*/', i + 2, 2))
    else if (s.startsWith('<!--', i)) blank(upTo('-->', i + 4, 3))
    else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1
      while (j < s.length && s[j] !== c && (c === '`' || s[j] !== '\n')) j += s[j] === '\\' ? 2 : 1
      out += s.slice(i, j + 1)
      i = j + 1
    } else out += s[i++]
  }
  return out
}

const SAFE = /sanitize|dompurify|purify|escapeHtml|xss\(/i
const ATTRS = ['dangerouslysetinnerhtml', 'v-html', 'set:html']
const TEXT = [
  [/\{@html\s+([^}]*)\}/g, '{@html}'],
  [/\.(?:inner|outer)HTML\s*=(?!=)\s*([^;\n]*)/g, 'innerHTML'],
  [/\.insertAdjacentHTML\(\s*['"`][\w-]+['"`]\s*,\s*([^;\n]*)/g, 'insertAdjacentHTML'],
  [/\bdocument\.write(?:ln)?\(\s*([^;\n]*)/g, 'document.write'],
  [/\bbypassSecurityTrust(?:Html|Script|Style|Url|ResourceUrl)\(\s*([^;\n]*)/g, 'bypassSecurityTrust']
]
const literalOnly = (v) => /^\s*(?:(['"])(?:(?!\1)[^\\]|\\.)*\1|`[^`$]*`)\s*\)?\s*;?\s*$/.test(v)

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component) continue
      for (const name of ATTRS) {
        const a = el.attrs.get(name)
        if (!a || !a.dynamic && name !== 'v-html') continue
        const v = a.value || ''
        if (SAFE.test(v) || literalOnly(v)) continue
        if (el.name === 'script' && /JSON\.stringify/.test(v)) continue
        ctx.report(el, `${a.raw} renders HTML from "${v.trim().slice(0, 40)}"; render it as text, or sanitize it with DOMPurify first.`)
      }
    }
    const code = codeOnly(ctx.text)
    for (const [re, sink] of TEXT)
      for (const m of code.matchAll(re)) {
        const v = m[1] || ''
        if (SAFE.test(v) || (sink !== 'bypassSecurityTrust' && literalOnly(v)) || /^\s*['"`]{2}\s*;?\s*$/.test(v)) continue
        ctx.report(ctx.lineOf(m.index), `${sink} with "${v.trim().slice(0, 40)}" can run injected script; use textContent or framework text, or sanitize with DOMPurify.`)
      }
  }
}
