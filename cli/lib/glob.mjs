/*
 * Turns a glob such as "src/**\/*.{ts,tsx}" into a regular expression over "/"-separated relative paths. Supports
 * "**", "*", "?", "{a,b}" and character classes; enough for profile excludes and for testing the globs an adapter
 * writes into an agent's rule file against fixture paths.
 */

export function globToRegExp(glob) {
  let re = ''
  let i = 0
  let inGroup = false
  while (i < glob.length) {
    const c = glob[i]
    if (c === '*') {
      if (glob[i + 1] === '*') {
        if (glob[i + 2] === '/') {
          re += '(?:.*/)?'
          i += 3
        } else {
          re += '.*'
          i += 2
        }
        continue
      }
      re += '[^/]*'
    } else if (c === '?') re += '[^/]'
    else if (c === '{') {
      re += '(?:'
      inGroup = true
    } else if (c === '}' && inGroup) {
      re += ')'
      inGroup = false
    } else if (c === ',' && inGroup) re += '|'
    else if (c === '[') {
      const e = glob.indexOf(']', i)
      if (e === -1) re += '\\['
      else {
        re += glob.slice(i, e + 1)
        i = e
      }
    } else re += /[.+^$()|\\]/.test(c) ? `\\${c}` : c
    i++
  }
  return new RegExp(`^${re}$`)
}

/** True when the path matches any of the globs. */
export const matchesAny = (file, globs) => globs.some((g) => globToRegExp(g).test(file))
