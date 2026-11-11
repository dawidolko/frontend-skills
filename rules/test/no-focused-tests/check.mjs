/*
 * test/no-focused-tests: reports focused tests left in the code: describe.only, it.only, test.only,
 * test.describe.only, context.only, fit and fdescribe. Comments are ignored. The engine reads .js, .jsx and .tsx
 * files; .ts test files are not read yet.
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

const RE = /\b(?:describe|it|test|context|suite)\.only\s*\(|\b(?:fit|fdescribe)\s*\(/g

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    for (const m of code.matchAll(RE))
      ctx.report(ctx.lineOf(m.index), `${m[0].replace(/\s*\($/, '')} runs only this test and silently skips the rest; remove it before committing.`)
  }
}
