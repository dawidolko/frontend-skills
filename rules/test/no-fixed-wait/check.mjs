/*
 * test/no-fixed-wait: reports fixed-time waits in tests: Playwright page.waitForTimeout(), Cypress cy.wait() with a
 * number, and new Promise((r) => setTimeout(r, n)) sleeps in files that contain tests. Comments are ignored.
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
  [/\.waitForTimeout\s*\(/g, 'page.waitForTimeout() waits a fixed time; wait for a condition with a web-first assertion or locator.waitFor().'],
  [/\bcy\.wait\(\s*\d/g, 'cy.wait(<ms>) waits a fixed time; wait on a route alias (cy.wait("@save")) or an assertion.'],
  [/\bnew Promise\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*setTimeout\(\s*\1\s*,\s*\d/g, 'A sleep in a test waits a fixed time; use fake timers or wait for a condition.']
]

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    const isTest = /\b(?:describe|it|test)\s*\(|@playwright\/test|from ['"](?:vitest|@jest\/globals)['"]|\bcy\./.test(code)
    for (const [re, message] of PATTERNS) {
      if (re === PATTERNS[2][0] && !isTest) continue
      for (const m of code.matchAll(re)) ctx.report(ctx.lineOf(m.index), message)
    }
  }
}
