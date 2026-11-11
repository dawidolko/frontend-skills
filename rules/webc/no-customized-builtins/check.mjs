/*
 * webc/no-customized-builtins: reports customElements.define(...) with an options object that has extends, and
 * native elements in markup with a literal is="name-with-hyphen" attribute. Vue's is="vue:..." and the is of
 * Vue's <component> are framework syntax and are left out.
 */
import { closing, findInCode, splitArgs } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /customElements\s*\.\s*define\s*\(/g)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const args = splitArgs(f.code, open, end)
      if (args[2] && /\bextends\s*:/.test(f.code.slice(args[2].start, args[2].end)))
        ctx.report(ctx.lineOf(f.index), 'This defines a customized built-in (extends), which Safari does not support; define an autonomous element instead.')
    }
    for (const el of ctx.elements()) {
      const is = el.attrs.get('is')
      if (!is || is.dynamic || el.name === 'component' || /^vue:/.test(is.value) || !is.value.includes('-')) continue
      ctx.report(is.line, `<${el.name} is="${is.value}"> is a customized built-in, which Safari does not support; use <${is.value}> wrapping a native element.`)
    }
  }
}
