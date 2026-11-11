/*
 * webc/lit-class-fields: in JavaScript files (not TypeScript, where the compiler option decides), reports a class
 * field of a LitElement subclass whose name is also one of its reactive properties (static properties or a
 * @property()/@state() decorator). Fields marked accessor, declare or static are left out.
 */
import { findInCode } from '../../js/source.mjs'
import { classes, fields, reactiveNames } from '../lit.mjs'

export default {
  check(ctx) {
    const seen = new Set()
    for (const f of findInCode(ctx, /extends\s+[\w$.]*LitElement\b/g)) {
      if (f.ts || seen.has(f.offset)) continue
      seen.add(f.offset)
      for (const cls of classes(f.code, /LitElement/)) {
        const names = reactiveNames(f.code, cls)
        for (const field of fields(f.code, cls))
          if (names.has(field.name) && !field.isStatic && !/\b(?:accessor|declare)\b/.test(field.modifiers))
            ctx.report(
              ctx.lineOf(f.offset + field.index),
              `The class field ${field.name} hides Lit's reactive property; set it in the constructor (or use accessor).`
            )
      }
    }
  }
}
