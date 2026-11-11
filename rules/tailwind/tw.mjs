/*
 * Shared by the tailwind rules: reads the class list of an element (only when it is a literal, so a conditional
 * expression never makes two alternatives look like one list), splits a class into its variants and utility, and
 * finds the package.json files of a project with their Tailwind version for the project-level checks.
 */
import { literal } from '../../engine/helpers.mjs'

/** The class tokens of an element when its class attribute is a literal string; otherwise null. */
export function literalClasses(el) {
  const a = el.attrs.get('class')
  if (!a) return []
  const v = literal(a)
  if (v === null || /[{}$]/.test(v)) return null
  return v.split(/\s+/).filter(Boolean)
}

/** { variants: 'md:hover:', utility: 'p-4', important: false } for a class such as md:hover:p-4 or p-4!. */
export function splitClass(token) {
  let depth = 0
  let cut = -1
  for (let i = 0; i < token.length; i++) {
    const c = token[i]
    if (c === '[' || c === '(') depth++
    else if (c === ']' || c === ')') depth--
    else if (c === ':' && depth === 0) cut = i
  }
  let utility = token.slice(cut + 1)
  let important = false
  if (utility.startsWith('!') || utility.endsWith('!')) {
    important = true
    utility = utility.replace(/^!|!$/g, '')
  }
  return { variants: token.slice(0, cut + 1), utility, important }
}

const DEP_KEYS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

/** The major version declared for a package in a package.json object, or null. */
export function majorOf(pkg, name) {
  for (const k of DEP_KEYS) {
    const range = pkg?.[k]?.[name]
    if (typeof range !== 'string') continue
    const m = /(\d+)/.exec(range.replace(/^(?:workspace:|npm:[^@]+@)/, ''))
    return m ? Number(m[1]) : null
  }
  return null
}

/** True when a package.json object declares the package in any dependency list. */
export const hasDep = (pkg, name) => DEP_KEYS.some((k) => typeof pkg?.[k]?.[name] === 'string')

/**
 * The package.json files of the project: the root one and the nearest one above every listed file, as
 * [{ dir, path, pkg, text, files }] where files are the listed files that belong to that package.
 */
export function packages(ctx) {
  const found = new Map()
  const load = (dir) => {
    if (found.has(dir)) return found.get(dir)
    const p = dir ? `${dir}/package.json` : 'package.json'
    const text = ctx.read(p)
    let pkg = null
    try {
      pkg = text ? JSON.parse(text) : null
    } catch {
      pkg = null
    }
    const entry = pkg ? { dir, path: p, pkg, text, files: [] } : null
    found.set(dir, entry)
    return entry
  }
  load('')
  for (const f of ctx.files) {
    const parts = f.path.split('/').slice(0, -1)
    for (let n = parts.length; n >= 0; n--) {
      const entry = load(parts.slice(0, n).join('/'))
      if (entry) {
        entry.files.push(f)
        break
      }
    }
  }
  return [...found.values()].filter(Boolean)
}

/** The 1-based line of the first match of re in text, or 1. */
export function lineOfMatch(text, re) {
  const m = re.exec(text)
  return m ? text.slice(0, m.index).split('\n').length : 1
}
