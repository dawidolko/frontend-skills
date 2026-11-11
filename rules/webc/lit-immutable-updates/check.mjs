/*
 * webc/lit-immutable-updates: in LitElement subclasses, reports in-place array mutations (push, pop, shift,
 * unshift, splice, sort, reverse, fill, copyWithin) of a reactive property through this.<name>, unless
 * this.requestUpdate() appears within the following lines of the same method.
 */
import { findInCode } from '../../js/source.mjs'
import { classes, reactiveNames } from '../lit.mjs'

const MUTATE = /this\s*\.\s*([\w$]+)\s*\.\s*(push|pop|shift|unshift|splice|sort|reverse|fill|copyWithin)\s*\(/g

export default {
  check(ctx) {
    const seen = new Set()
    for (const f of findInCode(ctx, /extends\s+[\w$.]*LitElement\b/g)) {
      if (seen.has(f.offset)) continue
      seen.add(f.offset)
      for (const cls of classes(f.code, /LitElement/)) {
        const names = reactiveNames(f.code, cls)
        const body = f.code.slice(cls.open, cls.end)
        MUTATE.lastIndex = 0
        let m
        while ((m = MUTATE.exec(body))) {
          if (!names.has(m[1])) continue
          const after = body.slice(m.index, m.index + 400)
          const end = after.search(/\n\s{0,2}\}/)
          if (/requestUpdate\s*\(/.test(end > 0 ? after.slice(0, end) : after)) continue
          ctx.report(ctx.lineOf(f.offset + cls.open + m.index), `this.${m[1]}.${m[2]}() mutates a reactive array in place, so Lit does not render; assign a new array.`)
        }
      }
    }
  }
}
