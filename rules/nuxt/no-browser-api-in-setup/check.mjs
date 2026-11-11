/*
 * nuxt/no-browser-api-in-setup: reports window, document, localStorage, sessionStorage and navigator used at the top
 * level of <script setup> in a Nuxt project. Uses inside functions and callbacks (onMounted, handlers), lines that
 * test import.meta.client, process.client or typeof window, and client-only components (*.client.vue) are left out.
 */
import { blank } from '../../js/source.mjs'
import { blocks, runsAtTopLevel } from '../script.mjs'

const GUARD = /import\.meta\.(?:client|browser)|process\.(?:client|browser)|typeof\s+(?:window|document|localStorage|navigator)/

export default {
  check(ctx) {
    if (/\.client\.vue$/i.test(ctx.file)) return
    for (const b of blocks(ctx)) {
      if (!b.setup) continue
      const code = blank(b.text)
      const lines = b.text.split('\n')
      const re = /(?<![\w$.])(window|document|localStorage|sessionStorage|navigator)(?![\w$])(?!\s*:)/g
      for (const m of code.matchAll(re)) {
        if (!runsAtTopLevel(code, m.index)) continue
        const line = ctx.lineOf(b.offset + m.index)
        const local = code.slice(0, m.index).split('\n').length - 1
        if (GUARD.test(lines[local] || '')) continue
        ctx.report(line, `${m[1]} does not exist on the server; read it in onMounted, behind import.meta.client, or with useCookie.`)
      }
    }
  }
}
