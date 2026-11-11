/*
 * nuxt/async-data-key: reports useAsyncData and useLazyAsyncData whose first argument is the handler function
 * (no key) when the call is inside a composable, a named function starting with "use". A function followed by a
 * second function argument is a key getter and is accepted. At the top of a component's setup the generated key is
 * unique and the call is left out.
 */
import { blank, closing, scriptBlocks, splitArgs } from '../../js/source.mjs'
import { enclosingFunction } from '../script.mjs'

export default {
  check(ctx) {
    for (const b of scriptBlocks(ctx)) {
      const code = blank(b.text)
      const re = /(?<![\w$.])(useAsyncData|useLazyAsyncData)\s*(?:<[^>\n]*>)?\s*\(\s*(?:async\s+)?(?:function\b|\([^()]*\)\s*=>|[\w$]+\s*=>)/g
      for (const m of code.matchAll(re)) {
        const fn = enclosingFunction(code, m.index)
        if (!fn || !/^use[A-Z0-9_]/.test(fn.name)) continue
        const open = code.indexOf('(', m.index + m[1].length)
        const end = closing(code, open)
        const args = end > 0 ? splitArgs(code, open, end) : []
        if (args.length > 1 && /^\s*(?:async\s+)?(?:function\b|\([^()]*\)\s*=>|[\w$]+\s*=>)/.test(code.slice(args[1].start, args[1].end))) continue
        ctx.report(
          ctx.lineOf(b.offset + m.index),
          `${m[1]} in ${fn.name}() has no key; every caller would share one cache entry. Pass a key built from the inputs.`
        )
      }
    }
  }
}
