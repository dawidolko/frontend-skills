/*
 * security/window-open-noopener: reports window.open(url, '_blank') calls with no third argument, which leave
 * window.opener set for the new page. Links with target="_blank" are not reported: browsers imply noopener for them.
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

const RE = /\bwindow\.open\(\s*[^,()]+(?:\([^()]*\))?[^,()]*,\s*['"`]_blank['"`]\s*\)/g

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    for (const m of code.matchAll(RE)) ctx.report(ctx.lineOf(m.index), 'window.open(url, "_blank") gives the new page access to window.opener; add "noopener,noreferrer" as the third argument.')
  }
}
