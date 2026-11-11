/*
 * vue/detailed-props: reports defineProps([...]) in a script of a Vue file, and props: [...] when it is a top-level
 * key of the component object (export default { ... } or defineComponent({ ... })). Other objects that happen to
 * have a props array are left out.
 */
import { closing, findInCode } from '../../js/source.mjs'

function depthIn(code, from, to) {
  let depth = 0
  for (let i = from; i < to; i++) {
    if ('{[('.includes(code[i])) depth++
    else if ('}])'.includes(code[i])) depth--
  }
  return depth
}

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])defineProps\s*\(\s*\[/g))
      ctx.report(ctx.lineOf(f.index), 'Props declared as an array of names have no types; use a type or an object with type and required.')
    for (const f of findInCode(ctx, /(?:export\s+default|defineComponent\s*\()\s*\{/g)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const re = /(?<![\w$.])props\s*:\s*\[/g
      re.lastIndex = open
      for (const m of f.code.matchAll(re)) {
        if (m.index >= end) break
        if (depthIn(f.code, open, m.index) === 1)
          ctx.report(ctx.lineOf(f.offset + m.index), 'Props declared as an array of names have no types; use an object with type and required.')
      }
    }
  }
}
