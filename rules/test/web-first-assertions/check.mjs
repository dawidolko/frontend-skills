/*
 * test/web-first-assertions: in files that import @playwright/test, reports assertions on a value read once from the
 * page, such as expect(await locator.isVisible()).toBe(true), where an auto-retrying web-first matcher exists.
 * Comments are ignored.
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

const RE =
  /\bexpect\(\s*await\s+[^;\n]*?\.(isVisible|isHidden|isEnabled|isDisabled|isChecked|isEditable|textContent|innerText|inputValue|getAttribute|count)\(/g
const BETTER = {
  isVisible: 'toBeVisible()',
  isHidden: 'toBeHidden()',
  isEnabled: 'toBeEnabled()',
  isDisabled: 'toBeDisabled()',
  isChecked: 'toBeChecked()',
  isEditable: 'toBeEditable()',
  textContent: 'toHaveText()',
  innerText: 'toHaveText()',
  inputValue: 'toHaveValue()',
  getAttribute: 'toHaveAttribute()',
  count: 'toHaveCount()'
}

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    if (!/@playwright\/test/.test(code)) return
    for (const m of code.matchAll(RE))
      ctx.report(ctx.lineOf(m.index), `expect(await ….${m[1]}()) checks once; use await expect(locator).${BETTER[m[1]]}, which retries until it passes.`)
  }
}
