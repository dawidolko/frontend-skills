/*
 * svelte/derived-not-effect: reports an $effect (or $effect.pre) whose whole body only assigns values to variables
 * declared with $state in the same script. An effect that also does anything else (a call, a DOM write, a
 * condition) is left out, since it may be syncing with something outside Svelte.
 */
import { closing, findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /\$effect(?:\.pre)?\s*\(\s*\(\s*\)\s*=>\s*/g)) {
      const states = new Set([...f.code.matchAll(/(?:let|const)\s+([\w$]+)\s*(?::[^=]+)?=\s*\$state(?:\.raw)?\s*\(/g)].map((m) => m[1]))
      if (states.size === 0) continue
      const start = f.match.index + f.match[0].length
      let inner
      if (f.code[start] === '{') {
        const end = closing(f.code, start)
        if (end < 0) continue
        inner = f.code.slice(start + 1, end - 1)
      } else {
        const end = closing(f.code, f.code.indexOf('(', f.match.index))
        if (end < 0) continue
        inner = f.code.slice(start, end - 1).trim()
        while (inner.startsWith('(') && closing(inner, 0) === inner.length) inner = inner.slice(1, -1).trim()
      }
      const statements = inner.split(/[;\n]/).map((s) => s.trim()).filter(Boolean)
      if (statements.length === 0) continue
      const targets = statements.map((s) => /^([\w$]+)\s*=(?!=)\s*\S/.exec(s)?.[1])
      if (targets.every((t) => t && states.has(t)))
        ctx.report(ctx.lineOf(f.index), `This $effect only copies a computed value into ${[...new Set(targets)].join(', ')}; declare it with $derived instead.`)
    }
  }
}
