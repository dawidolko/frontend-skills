/*
 * security/postmessage-origin: reports postMessage calls with the target origin "*", and window message listeners in
 * a file that never reads .origin. Worker and MessagePort listeners are not reported: their messages have no origin
 * to check. Comments are ignored.
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

const STAR = /\.postMessage\([^;\n]*?,\s*['"`]\*['"`]\s*[,)]/g
const LISTEN = /\b(?:window|globalThis)\.addEventListener\(\s*['"`]message['"`]|\b(?:window|globalThis)\.onmessage\s*=|<svelte:window[^>]*\bon:?message\s*=/g

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    for (const m of code.matchAll(STAR)) ctx.report(ctx.lineOf(m.index), 'postMessage with targetOrigin "*" sends the data to any page in that window; name the exact origin.')
    if (/\.origin\b/.test(code)) return
    for (const m of code.matchAll(LISTEN)) ctx.report(ctx.lineOf(m.index), 'A window message listener never checks event.origin; accept messages only from an exact allowlist.')
  }
}
