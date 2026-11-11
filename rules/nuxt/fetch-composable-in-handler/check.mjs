/*
 * nuxt/fetch-composable-in-handler: reports useFetch, useLazyFetch, useAsyncData and useLazyAsyncData called inside
 * a named function whose name does not start with "use" (a handler such as onSubmit or save). Calls at the top of
 * setup, inside composables (useOrders) and inside anonymous callbacks (onMounted, watch) are left out.
 */
import { blank, scriptBlocks } from '../../js/source.mjs'
import { enclosingFunction } from '../script.mjs'

export default {
  check(ctx) {
    for (const b of scriptBlocks(ctx)) {
      const code = blank(b.text)
      const re = /(?<![\w$.])(useFetch|useLazyFetch|useAsyncData|useLazyAsyncData)\s*(?:<[^>\n]*>)?\s*\(/g
      let m
      while ((m = re.exec(code))) {
        const fn = enclosingFunction(code, m.index)
        if (!fn || /^use[A-Z0-9_]/.test(fn.name) || fn.name === 'setup' || /^define[A-Z]/.test(fn.name)) continue
        ctx.report(ctx.lineOf(b.offset + m.index), `${m[1]} inside ${fn.name}(); call it in setup or a composable, and use $fetch in handlers.`)
      }
    }
  }
}
