/*
 * Shared by the sass rules: finds the SCSS of a file (the whole .scss file, or the <style lang="scss"> blocks of
 * Vue, Svelte and Astro components) and blanks out comments, keeping every character's position and line break,
 * so a check can search statements with a regular expression and map a match to its line with
 * ctx.lineOf(offset + index). With strings: true the contents of quoted strings are blanked as well. The engine's
 * CSS parser keeps only rule blocks and declarations, while these checks also need statements such as @import,
 * @use, @function, @return and top-level variables.
 */

const STYLE = /<style\b([^>]*)>([\s\S]*?)<\/style\s*>/gi

/** The SCSS parts of a file: [{ text, offset }]. */
export function scssBlocks(ctx) {
  if (ctx.kind === 'scss') return [{ text: ctx.text, offset: 0 }]
  if (!['vue', 'svelte', 'astro'].includes(ctx.kind)) return []
  const out = []
  STYLE.lastIndex = 0
  let m
  while ((m = STYLE.exec(ctx.text))) {
    if (!/\blang\s*=\s*["']?scss\b/i.test(m[1])) continue
    out.push({ text: m[2], offset: m.index + m[0].indexOf('>') + 1 })
  }
  return out
}

/** The text with comments (and, with strings: true, string contents) replaced by spaces. */
export function blankScss(text, { strings = false } = {}) {
  const out = text.split('')
  const wipe = (a, b) => {
    for (let k = a; k < b && k < text.length; k++) if (out[k] !== '\n') out[k] = ' '
  }
  let i = 0
  while (i < text.length) {
    const c = text[i]
    if (c === '/' && text[i + 1] === '*') {
      const e = text.indexOf('*/', i + 2)
      const end = e === -1 ? text.length : e + 2
      wipe(i, end)
      i = end
      continue
    }
    if (c === '/' && text[i + 1] === '/' && text[i - 1] !== ':') {
      const e = text.indexOf('\n', i)
      const end = e === -1 ? text.length : e
      wipe(i, end)
      i = end
      continue
    }
    if (c === '"' || c === "'") {
      let j = i + 1
      while (j < text.length && text[j] !== c && text[j] !== '\n') j += text[j] === '\\' ? 2 : 1
      if (strings) wipe(i + 1, j)
      i = j + 1
      continue
    }
    i++
  }
  return out.join('')
}

/** Every match of re (global) in the SCSS of the file: [{ match, index (in the file), code, offset }]. */
export function findInScss(ctx, re, options) {
  const found = []
  for (const block of scssBlocks(ctx)) {
    const code = blankScss(block.text, options)
    re.lastIndex = 0
    let m
    while ((m = re.exec(code))) {
      found.push({ match: m, index: block.offset + m.index, at: m.index, code, offset: block.offset, raw: block.text })
      if (m[0] === '') re.lastIndex++
    }
  }
  return found
}

/** The [start, end) ranges of @function bodies in code, with their names: [{ name, start, end }]. */
export function functionRanges(code) {
  const out = []
  const re = /@function\s+([\w-]+)\s*\(/g
  let m
  while ((m = re.exec(code))) {
    const open = code.indexOf('{', m.index)
    if (open < 0) break
    let depth = 0
    let end = code.length
    for (let i = open; i < code.length; i++) {
      if (code[i] === '{') depth++
      else if (code[i] === '}' && --depth === 0) {
        end = i + 1
        break
      }
    }
    out.push({ name: m[1], start: m.index, end, body: code.slice(open, end) })
  }
  return out
}
