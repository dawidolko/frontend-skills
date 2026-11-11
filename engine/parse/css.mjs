/*
 * Reads CSS, SCSS and Less into a flat list of rule blocks: each with its prelude (selector or at-rule), the chain of
 * enclosing preludes (for nesting and media queries), its declarations with their line numbers, and the line the
 * block starts on. Comments and strings are skipped; SCSS "//" comments and "#{...}" interpolation are understood.
 * It does not compute the cascade: rules ask local questions ("does this :focus rule remove the outline and add
 * nothing else?"), which is what a static check can answer honestly. The indented Sass syntax is not read.
 */

/**
 * Parses CSS text. offset is added to every index so embedded <style> blocks report lines of the whole file;
 * lineOf maps an index of the whole file to its line. Returns { blocks } where a block is
 * { prelude, parents, decls: [{ prop, value, important, line }], line, atRule }.
 */
export function parseCss(text, { offset = 0, lineOf, scss = false } = {}) {
  const line = lineOf || ((i) => text.slice(0, i).split('\n').length)
  const blocks = []
  const stack = []
  let buf = ''
  let bufStart = -1
  const s = text
  let i = 0
  const flushDecl = () => {
    const raw = buf.trim()
    if (raw && stack.length) {
      const colon = raw.indexOf(':')
      if (colon > 0 && !raw.startsWith('@')) {
        const prop = raw.slice(0, colon).trim().toLowerCase()
        let value = raw.slice(colon + 1).trim()
        const important = /!\s*important\s*$/i.test(value)
        if (important) value = value.replace(/!\s*important\s*$/i, '').trim()
        if (/^[-\w$@]+$/.test(prop)) stack[stack.length - 1].decls.push({ prop, value, important, line: line(offset + bufStart) })
      }
    }
    buf = ''
    bufStart = -1
  }
  while (i < s.length) {
    const c = s[i]
    if (c === '/' && s[i + 1] === '*') {
      const e = s.indexOf('*/', i + 2)
      i = e === -1 ? s.length : e + 2
      continue
    }
    if (scss && c === '/' && s[i + 1] === '/' && s[i - 1] !== ':') {
      const e = s.indexOf('\n', i)
      i = e === -1 ? s.length : e
      continue
    }
    if (c === '"' || c === "'") {
      let j = i + 1
      while (j < s.length && s[j] !== c && s[j] !== '\n') j += s[j] === '\\' ? 2 : 1
      if (bufStart < 0) bufStart = i
      buf += s.slice(i, j + 1)
      i = j + 1
      continue
    }
    if (c === '#' && s[i + 1] === '{') {
      const e = s.indexOf('}', i)
      if (bufStart < 0) bufStart = i
      buf += s.slice(i, e === -1 ? s.length : e + 1)
      i = e === -1 ? s.length : e + 1
      continue
    }
    if (c === '{') {
      const prelude = buf.trim().replace(/\s+/g, ' ')
      const start = bufStart < 0 ? i : bufStart
      const block = {
        prelude,
        parents: stack.map((b) => b.prelude),
        decls: [],
        line: line(offset + start),
        atRule: prelude.startsWith('@') ? prelude.slice(1).split(/[\s(]/)[0].toLowerCase() : null
      }
      blocks.push(block)
      stack.push(block)
      buf = ''
      bufStart = -1
      i++
      continue
    }
    if (c === '}') {
      flushDecl()
      stack.pop()
      i++
      continue
    }
    if (c === ';') {
      flushDecl()
      i++
      continue
    }
    if (bufStart < 0 && !/\s/.test(c)) bufStart = i
    if (bufStart >= 0) buf += c
    i++
  }
  return { blocks }
}

/** The selector a nested block resolves to, joining "&" with its parents; at-rules are left out. */
export function fullSelector(block) {
  let sel = ''
  for (const p of [...block.parents, block.prelude]) {
    if (p.startsWith('@')) continue
    sel = sel && p.includes('&') ? p.replace(/&/g, sel) : sel ? `${sel} ${p}` : p
  }
  return sel
}
