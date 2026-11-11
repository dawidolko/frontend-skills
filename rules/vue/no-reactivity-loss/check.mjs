/*
 * vue/no-reactivity-loss: reports object destructuring of a reactive() call or of a variable declared with
 * reactive(), and reassignment of a let variable declared with reactive(). Destructuring through toRefs() and
 * destructuring defineProps() (reactive since Vue 3.5) are correct and not reported.
 */
import { findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?:const|let|var)\s*\{[^}]*\}\s*=\s*(?:shallowReactive|reactive)\s*\(/g))
      ctx.report(ctx.lineOf(f.index), 'Destructuring reactive() loses reactivity; use toRefs() or keep the object.')
    for (const f of findInCode(ctx, /(const|let)\s+([\w$]+)\s*(?::[^=\n]+)?=\s*(?:shallowReactive|reactive)\s*(?:<[^>\n]*>)?\s*\(/g)) {
      const [, kind, n] = f.match
      const after = f.match.index + f.match[0].length
      const rest = f.code.slice(after)
      const destructure = new RegExp(`(?:const|let|var)\\s*\\{[^}]*\\}\\s*=\\s*${n}\\s*(?:$|[;\\n)])`, 'gm')
      let m
      while ((m = destructure.exec(rest))) ctx.report(ctx.lineOf(f.offset + after + m.index), `Destructuring ${n} (reactive) gives plain copies; use toRefs(${n}).`)
      if (kind !== 'let') continue
      const assign = new RegExp(`(?<![\\w$.])${n}\\s*=(?![=>])`, 'g')
      while ((m = assign.exec(rest))) ctx.report(ctx.lineOf(f.offset + after + m.index), `Reassigning ${n} replaces the reactive proxy; use Object.assign(${n}, ...) or a ref.`)
    }
  }
}
