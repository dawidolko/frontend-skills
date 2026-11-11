/*
 * vue/no-mutating-props: in a script that names its props (const props = defineProps(...) or
 * withDefaults(defineProps(...))), reports assignments, ++ and -- on props.x (and deeper fields) and calls of
 * array methods that change the array in place (push, pop, splice, shift, unshift, sort, reverse, fill).
 */
import { findInCode } from '../../js/source.mjs'

const MUTATORS = 'push|pop|splice|shift|unshift|sort|reverse|fill|copyWithin'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?:const|let)\s+([\w$]+)\s*(?::[^=]+)?=\s*(?:withDefaults\s*\(\s*)?defineProps\b/g)) {
      const p = f.match[1]
      const code = f.code
      const path = `(?<![\\w$.])${p}\\s*\\.\\s*[\\w$]+(?:\\s*\\.\\s*[\\w$]+|\\s*\\[[^\\]\\n]*\\])*`
      const res = [
        new RegExp(`${path}\\s*(?:[-+*/%]?=(?!=)|\\+\\+|--)`, 'g'),
        new RegExp(`(?:\\+\\+|--)\\s*${path}`, 'g'),
        new RegExp(`${path}\\s*\\.\\s*(?:${MUTATORS})\\s*\\(`, 'g')
      ]
      const seen = new Set()
      for (const re of res) {
        for (const m of code.matchAll(re)) {
          const line = ctx.lineOf(f.offset + m.index)
          if (seen.has(line)) continue
          seen.add(line)
          ctx.report(line, `${m[0].trim()} changes a prop; emit an event (or defineModel) or work on a local copy.`)
        }
      }
    }
  }
}
