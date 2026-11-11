/*
 * security/no-eval: reports eval(), new Function() and string arguments to setTimeout or setInterval in front-end
 * code. Methods that happen to be called eval on other objects (sandbox.eval) are left alone; comments are ignored.
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
  [/(?:^|[^.\w$]|\b(?:window|globalThis|self)\.)eval\s*\(/g, 'eval() runs a string as code; parse data with JSON.parse or call the function directly.'],
  [/\bnew\s+Function\s*\(/g, 'new Function() compiles a string to code; write the function in the source.'],
  [/\bset(?:Timeout|Interval)\s*\(\s*['"`]/g, 'A string passed to setTimeout or setInterval is evaluated as code; pass a function.']
]

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    for (const [re, message] of PATTERNS) for (const m of code.matchAll(re)) ctx.report(ctx.lineOf(m.index + m[0].search(/eval|new|set/)), message)
  }
}
