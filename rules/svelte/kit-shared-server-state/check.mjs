/*
 * svelte/kit-shared-server-state: a project check over the server modules of a SvelteKit app: the +page.server,
 * +layout.server and +server files next to each route component, src/hooks.server, and any listed .js file whose
 * name marks it as server code. It reads .js and .ts by path, so TypeScript files are covered. It reports a
 * top-level let that a function reassigns, and a top-level array or object literal that a function pushes to or
 * writes a property of; writes at module level (filling a table in a top-level loop) are not per request. Maps and Sets (often deliberate caches or rate limiters) are left out.
 */
import { blank } from '../../js/source.mjs'

const ROUTE = /^(.*\/)?(src\/routes\/(?:.*\/)?)\+(?:page|layout)(?:@[^/]*)?\.svelte$/
const SERVER_JS = /(?:\.server|\/\+server|\/server\/[^/]+)\.js$/

const NOT_FUNCTION = /(?:^|[^\w$.])(?:if|for|while|switch|catch|with)\s*$/

/** depth[i]: bracket depth at i; fn[i]: 1 when i is inside a function body (a brace after a parameter list or =>). */
function scopes(code) {
  const depth = new Int16Array(code.length + 1)
  const fn = new Uint8Array(code.length + 1)
  const stack = []
  let inFn = 0
  for (let i = 0; i < code.length; i++) {
    const c = code[i]
    depth[i] = stack.length
    fn[i] = inFn > 0 ? 1 : 0
    if (c === '{' || c === '(' || c === '[') {
      let isFn = false
      if (c === '{') {
        const before = code.slice(Math.max(0, i - 200), i).trimEnd()
        if (before.endsWith('=>')) isFn = true
        else if (before.endsWith(')')) {
          let d = 0
          let k = before.length - 1
          for (; k >= 0; k--) {
            if (before[k] === ')') d++
            else if (before[k] === '(' && --d === 0) break
          }
          isFn = k >= 0 && !NOT_FUNCTION.test(before.slice(0, k))
        }
      }
      stack.push(isFn)
      if (isFn) inFn++
    } else if (c === '}' || c === ')' || c === ']') {
      if (stack.pop()) inFn--
    }
  }
  return { depth, fn }
}

function candidates(files) {
  const out = new Set()
  for (const f of files) {
    const m = ROUTE.exec(f.path)
    if (m) {
      const dir = `${m[1] || ''}${m[2]}`
      for (const base of ['+page.server', '+layout.server', '+server']) for (const ext of ['.js', '.ts']) out.add(`${dir}${base}${ext}`)
      for (const ext of ['.js', '.ts']) out.add(`${m[1] || ''}src/hooks.server${ext}`)
    }
    if (f.kind === 'jsx' && SERVER_JS.test(f.path)) out.add(f.path)
  }
  return out
}

export default {
  check(ctx) {
    for (const file of candidates(ctx.files)) {
      const raw = ctx.read(file)
      if (!raw) continue
      const code = blank(raw)
      const { depth, fn } = scopes(code)
      const lineOf = (i) => code.slice(0, i).split('\n').length
      const decl = /(?:^|[;\n])[ \t]*(?:export\s+)?(let|const)\s+([\w$]+)\s*(?::[^=\n]+)?=?\s*([^\n;]*)/g
      for (const m of code.matchAll(decl)) {
        const at = m.index + m[0].search(/\S/)
        if (depth[at] !== 0) continue
        const [, kind, name, init] = m
        if (kind === 'const' && !/^(?:\[|\{)/.test(init.trim())) continue
        const write =
          kind === 'let'
            ? new RegExp(`(?<![\\w$.])${name}\\s*(?:[-+*/]?=(?!=)|\\+\\+|--)|(?:\\+\\+|--)${name}(?![\\w$])`, 'g')
            : new RegExp(`(?<![\\w$.])${name}\\s*(?:\\.\\s*(?:push|unshift|splice)\\s*\\(|(?:\\.[\\w$]+|\\[[^\\]]+\\])\\s*=(?!=))`, 'g')
        for (const w of code.matchAll(write)) {
          if (!fn[w.index]) continue
          ctx.report(
            { file, line: lineOf(at) },
            `${name} is module state on the server, shared by every user and request; keep request data inside load/actions or in a database.`
          )
          break
        }
      }
    }
  }
}
