/*
 * nuxt/no-module-scope-state: reports ref, reactive, shallowRef and shallowReactive declared at the top level of a
 * module (a .js or .jsx file, or a plain <script> block of a .vue file) in a Nuxt project. <script setup>, code inside
 * functions, client-only files (*.client.*) and server/ code (which does not render Vue state) are left out.
 */
import { blank } from '../../js/source.mjs'
import { blocks, depthAt } from '../script.mjs'

export default {
  check(ctx) {
    if (/\.client\.[a-z]+$/i.test(ctx.file) || /(?:^|\/)server\//.test(ctx.file)) return
    for (const b of blocks(ctx)) {
      if (b.setup) continue
      const code = blank(b.text)
      const re = /(?:^|[;\n])\s*(?:export\s+)?(?:const|let|var)\s+([\w$]+)\s*(?::[^=\n]+)?=\s*(ref|reactive|shallowRef|shallowReactive)\s*(?:<[^>\n]*>)?\s*\(/g
      for (const m of code.matchAll(re)) {
        const at = m.index + m[0].search(/\S/)
        if (depthAt(code, at) === 0)
          ctx.report(
            ctx.lineOf(b.offset + at),
            `${m[1]} = ${m[2]}() at module scope is shared by every request on the server; use useState('${m[1]}') or a store.`
          )
      }
    }
  }
}
