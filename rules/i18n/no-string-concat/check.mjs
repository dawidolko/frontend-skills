/*
 * i18n/no-string-concat: reports a translated string joined to other text with + or placed beside a second
 * translation in one template literal, such as t('cart.has') + count + t('cart.items'). Translation calls are
 * recognised by the common names t, $t, i18n.t, translate and formatMessage. Comments are ignored.
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

const T = String.raw`(?:\$?t|i18n\.t|t\.rich|translate|formatMessage)\(\s*['"\x60][\w.:-]+['"\x60][^()]*\)`
const CONCAT = new RegExp(String.raw`${T}\s*\+|\+\s*${T}|\$\{\s*${T}\s*\}[^\x60]*\$\{`, 'g')

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    for (const m of code.matchAll(CONCAT)) ctx.report(ctx.lineOf(m.index), 'A sentence is built from translated pieces; use one message with placeholders, such as t("cart.items", { count }).')
  }
}
