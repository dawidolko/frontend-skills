/*
 * security/no-secrets-in-client-env: reports references to client-exposed environment variables (NEXT_PUBLIC_,
 * VITE_, PUBLIC_, NUXT_PUBLIC_, REACT_APP_, EXPO_PUBLIC_, GATSBY_) whose name says SECRET, PRIVATE or PASSWORD.
 * Public keys meant for browsers (an analytics id, a maps key) are not reported. Comments are ignored. The audit does
 * not read .env files, so a definition there without a use in code is not found.
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

const RE = /\b(?:NEXT_PUBLIC|VITE|PUBLIC|NUXT_PUBLIC|REACT_APP|EXPO_PUBLIC|GATSBY)_[A-Z0-9_]*(?:SECRET|PRIVATE|PASSWORD|PASSWD)[A-Z0-9_]*/g

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    for (const m of code.matchAll(RE))
      ctx.report(ctx.lineOf(m.index), `${m[0]} is a public (bundled) variable named like a secret; anything with that prefix is shipped to every browser.`)
  }
}
