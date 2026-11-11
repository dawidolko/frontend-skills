/*
 * i18n/intl-format: reports dates built from getDate(), getMonth() or getFullYear() joined with "/", ".", "-" or
 * ":", and prices built from toFixed() joined with a currency sign or code. Comments are ignored.
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

const PATTERNS = [
  [
    /\.get(?:Date|Month|FullYear|Hours|Minutes)\(\)\s*(?:\+\s*1\s*\)?\s*)?\+\s*['"\x60]\s*[/.\-:]\s*['"\x60]/g,
    "A date is assembled by hand; use Intl.DateTimeFormat with the user's locale."
  ],
  [
    /\.toFixed\(\s*\d\s*\)\s*\+\s*['"\x60]\s*(?:zł|€|\$|£|PLN|EUR|USD|GBP|CHF|kr)/g,
    'A price is assembled by hand; use Intl.NumberFormat with style "currency".'
  ],
  [/['"\x60](?:\$|€|£)\s*['"\x60]\s*\+\s*[\w$.()[\]]+\.toFixed\(/g, 'A price is assembled by hand; use Intl.NumberFormat with style "currency".']
]

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    const seen = new Set()
    for (const [re, message] of PATTERNS)
      for (const m of code.matchAll(re)) {
        const line = ctx.lineOf(m.index)
        if (!seen.has(`${line} ${message}`)) ctx.report(line, message)
        seen.add(`${line} ${message}`)
      }
  }
}
