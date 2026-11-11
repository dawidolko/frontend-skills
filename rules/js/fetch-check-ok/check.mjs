/*
 * js/fetch-check-ok: reports a fetch whose body is read without a look at the status. Three shapes are read:
 * const res = await fetch(...) followed by res.json() (or text, blob, arrayBuffer, formData) with no res.ok,
 * res.status or call that receives res within the next lines; (await fetch(...)).json(); and
 * fetch(...).then((r) => r.json()). Wrappers such as $fetch or ky that throw on errors are not fetch and not read.
 */
import { closing, findInCode } from '../source.mjs'

const BODY = '(?:json|text|blob|arrayBuffer|formData)'
const WINDOW = 1500

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*await\s+fetch\s*\(/g)) {
      const name = f.match[1]
      const rest = f.code.slice(f.match.index + f.match[0].length, f.match.index + f.match[0].length + WINDOW)
      const read = new RegExp(`(?<![\\w$.])${name}\\s*\\.\\s*${BODY}\\s*\\(`).exec(rest)
      if (!read) continue
      const checked = new RegExp(`(?<![\\w$.])${name}\\s*\\.\\s*(?:ok|status)\\b|[(,]\\s*${name}\\s*[,)]|return\\s+${name}\\s*(?:[;}]|$)`, 'm').test(rest)
      if (!checked) ctx.report(ctx.lineOf(f.index), `Check ${name}.ok before ${name}.${/\.\s*(\w+)/.exec(read[0])[1]}(); fetch resolves on 404 and 500.`)
    }
    for (const f of findInCode(ctx, /\(\s*await\s+fetch\s*\(/g)) {
      const end = closing(f.code, f.match.index)
      if (end > 0 && new RegExp(`^\\s*\\.\\s*${BODY}\\s*\\(`).test(f.code.slice(end, end + 40)))
        ctx.report(ctx.lineOf(f.index), 'The body is read without checking response.ok; fetch resolves on 404 and 500.')
    }
    for (const f of findInCode(ctx, /(?<![\w$.])fetch\s*\(/g)) {
      const end = closing(f.code, f.match.index + f.match[0].length - 1)
      if (end < 0) continue
      const then = new RegExp(`^\\s*\\.\\s*then\\s*\\(\\s*(?:\\(\\s*([\\w$]+)\\s*\\)|([\\w$]+))\\s*=>\\s*([\\w$]+)\\s*\\.\\s*${BODY}\\s*\\(`).exec(
        f.code.slice(end, end + 120)
      )
      if (then && (then[1] || then[2]) === then[3])
        ctx.report(ctx.lineOf(f.index), 'The body is read without checking response.ok; fetch resolves on 404 and 500.')
    }
  }
}
