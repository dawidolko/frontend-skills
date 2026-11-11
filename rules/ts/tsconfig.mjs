/*
 * Shared by the project-level ts rules: finds the tsconfig files of a project (the root one, the nearest one above
 * every audited file, and the configs they list under "references"), reads them as JSON with comments and trailing
 * commas, finds the TypeScript version the nearest package.json asks for, and the line of a key for the report.
 * Paths are relative to the audit root with "/" separators (a leading "../" is kept, which the rule fixtures use
 * to point at their sample projects); ctx.read returns "" for a file that does not exist.
 */

const dirOf = (p) => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '')
const join = (dir, rel) => {
  const parts = []
  for (const part of `${dir}/${rel}`.split('/')) {
    if (!part || part === '.') continue
    if (part === '..' && parts.length && parts[parts.length - 1] !== '..') parts.pop()
    else parts.push(part)
  }
  return parts.join('/')
}

/** JSON with // and block comments and trailing commas, as tsconfig allows; null when it does not parse. */
export function parseJsonc(text) {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      let j = i + 1
      while (j < text.length && text[j] !== '"') j += text[j] === '\\' ? 2 : 1
      out += text.slice(i, j + 1)
      i = j
    } else if (c === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++
      out += '\n'
    } else if (c === '/' && text[i + 1] === '*') {
      const e = text.indexOf('*/', i + 2)
      out += text.slice(i, e === -1 ? text.length : e + 2).replace(/[^\n]/g, ' ')
      i = e === -1 ? text.length : e + 1
    } else out += c
  }
  try {
    return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'))
  } catch {
    return null
  }
}

/** Every tsconfig of the project: [{ path, text, data }], each once. */
export function tsconfigs(ctx) {
  const seen = new Map()
  const add = (p) => {
    if (seen.has(p)) return
    const text = ctx.read(p)
    seen.set(p, text ? { path: p, text, data: parseJsonc(text) } : null)
    const cfg = seen.get(p)
    for (const ref of cfg?.data?.references || []) {
      if (typeof ref?.path !== 'string') continue
      const target = join(dirOf(p), ref.path)
      add(/\.json$/i.test(target) ? target : join(target, 'tsconfig.json'))
    }
  }
  add('tsconfig.json')
  const dirs = new Set(ctx.files.map((f) => dirOf(f.path)))
  for (let dir of dirs) {
    for (;;) {
      const p = join(dir, 'tsconfig.json')
      if (ctx.read(p)) {
        add(p)
        break
      }
      if (!dir) break
      dir = dirOf(dir)
    }
  }
  return [...seen.values()].filter((c) => c && c.data)
}

/** The major TypeScript version the nearest package.json above the config asks for, or null. */
export function typescriptMajor(ctx, configPath) {
  let dir = dirOf(configPath)
  for (;;) {
    const text = ctx.read(join(dir, 'package.json'))
    if (text) {
      const pkg = parseJsonc(text) || {}
      const range = pkg.devDependencies?.typescript || pkg.dependencies?.typescript
      if (range) {
        const m = /(\d+)/.exec(range.replace(/^npm:@typescript\/typescript\d*@/, ''))
        return m ? Number(m[1]) : null
      }
    }
    if (!dir) return null
    dir = dirOf(dir)
  }
}

/** The nearest package.json above the config, parsed, or null. */
export function packageOf(ctx, configPath) {
  let dir = dirOf(configPath)
  for (;;) {
    const text = ctx.read(join(dir, 'package.json'))
    if (text) return parseJsonc(text)
    if (!dir) return null
    dir = dirOf(dir)
  }
}

/** The 1-based line of the first "key" in the config text, or 1. */
export function lineOfKey(text, key) {
  const i = text.search(new RegExp(`"${key}"\\s*:`))
  return i < 0 ? 1 : text.slice(0, i).split('\n').length
}

/** A solution-style config compiles nothing itself: "files": [] with references. */
export const isSolution = (data) => Array.isArray(data.files) && data.files.length === 0 && Array.isArray(data.references)
