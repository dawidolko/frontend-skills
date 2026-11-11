/*
 * perf/bfcache-no-unload: reports code that listens to the unload event (addEventListener('unload'), onunload =,
 * an onunload attribute, Svelte on:unload, jQuery .on('unload')). Comments are ignored.
 */
function codeOnly(s) {
  let out = ''
  let i = 0
  const blank = (end) => {
    out += s.slice(i, end).replace(/[^\n]/g, ' ')
    i = end
  }
  while (i < s.length) {
    const c = s[i]
    if (c === '/' && s[i + 1] === '/') blank(s.indexOf('\n', i) === -1 ? s.length : s.indexOf('\n', i))
    else if (c === '/' && s[i + 1] === '*') blank(s.indexOf('*/', i + 2) === -1 ? s.length : s.indexOf('*/', i + 2) + 2)
    else if (s.startsWith('<!--', i)) blank(s.indexOf('-->', i + 4) === -1 ? s.length : s.indexOf('-->', i + 4) + 3)
    else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1
      while (j < s.length && s[j] !== c && (c === '`' || s[j] !== '\n')) j += s[j] === '\\' ? 2 : 1
      out += s.slice(i, j + 1)
      i = j + 1
    } else out += s[i++]
  }
  return out
}

const PATTERNS = [/addEventListener\(\s*['"`]unload['"`]/g, /\bon:?unload\s*=/gi, /\.on\(\s*['"`]unload['"`]/g]

export default {
  check(ctx) {
    const code = codeOnly(ctx.text)
    for (const re of PATTERNS)
      for (const m of code.matchAll(re)) ctx.report(ctx.lineOf(m.index), 'An unload listener keeps the page out of the back/forward cache; use pagehide or visibilitychange.')
  }
}
