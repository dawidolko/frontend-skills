/*
 * nuxt/no-bare-fetch-in-setup: reports $fetch(...) at the top level of a <script setup> block of a Nuxt project.
 * Calls inside a function, a block, or a callback such as a useAsyncData handler are left out.
 */
import { blank } from '../../js/source.mjs'
import { blocks, runsAtTopLevel } from '../script.mjs'

export default {
  check(ctx) {
    for (const b of blocks(ctx)) {
      if (!b.setup) continue
      const code = blank(b.text)
      const re = /(?<![\w$.])\$fetch\s*(?:<[^>\n]*>)?\s*\(/g
      for (const m of code.matchAll(re))
        if (runsAtTopLevel(code, m.index))
          ctx.report(
            ctx.lineOf(b.offset + m.index),
            '$fetch at the top of script setup runs on the server and again in the browser; use useFetch or useAsyncData.'
          )
    }
  }
}
