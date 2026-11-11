/*
 * vue/ref-value-in-script: finds names declared with ref, shallowRef, computed, toRef or useTemplateRef in a script
 * block and reports where such a name is used as an operand without .value: as an if or while condition, after !,
 * in a comparison, in arithmetic, with ++ or --, or as the left side of a ternary, &&, || or ??. Passing the ref
 * to a function (watch(count, ...)) or returning it is correct and is not reported.
 */
import { findInCode } from '../../js/source.mjs'

const DECL = /(?:const|let)\s+([\w$]+)\s*(?::[^=\n]+)?=\s*(?:ref|shallowRef|computed|toRef|useTemplateRef|customRef)\s*(?:<[^>\n]*>)?\s*\(/g

export default {
  check(ctx) {
    const seen = new Set()
    for (const f of findInCode(ctx, DECL)) {
      const n = f.match[1]
      const code = f.code
      const name = `(?<![\\w$.])${n}(?![\\w$])(?!\\s*(?:\\.|\\(|\\?\\.|:|=(?!=)))`
      const res = [
        new RegExp(`\\b(?:if|while)\\s*\\(\\s*!*\\s*${name}\\s*\\)`, 'g'),
        new RegExp(`(?<![\\w$)\\]])!\\s*${name}`, 'g'),
        new RegExp(`${name}\\s*(?:===|!==|==|!=|<=|>=|<(?![\\w$])|>|\\+(?![+=])|-(?![-=>])|\\*|%|\\?(?![.?:])|&&|\\|\\||\\?\\?)`, 'g'),
        new RegExp(`(?:===|!==|==|!=|<=|>=|\\+|-|\\*|%)\\s*${name}`, 'g'),
        new RegExp(`${name}\\s*(?:\\+\\+|--)`, 'g')
      ]
      for (const re of res) {
        let m
        while ((m = re.exec(code))) {
          if (m.index < f.match.index + f.match[0].length) continue
          const line = ctx.lineOf(f.offset + m.index)
          if (seen.has(`${n}:${line}`)) continue
          seen.add(`${n}:${line}`)
          ctx.report(line, `${n} is a ref here; use ${n}.value in script code.`)
        }
      }
    }
  }
}
