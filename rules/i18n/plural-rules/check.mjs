/*
 * i18n/plural-rules: reports a conditional that picks a string by comparing a count-like value with 1
 * (count === 1 ? 'item' : 'items', or n > 1 ? t('photos') : t('photo')), which works only for languages with two plural forms. Comments are ignored.
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

const PLURAL = /\b([\w$.]*(?:count|length|total|num|qty|quantity|size|amount)\w*)\s*(===?|!==?|>)\s*1\s*\?\s*(?:['"\x60]|\$?t\(|i18n\.t\()/gi

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    for (const m of code.matchAll(PLURAL))
      ctx.report(ctx.lineOf(m.index), `Plural chosen with ${m[1]} ${m[2]} 1; use the locale's plural rules (ICU plural or Intl.PluralRules).`)
  }
}
