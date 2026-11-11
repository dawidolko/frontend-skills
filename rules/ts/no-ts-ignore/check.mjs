/*
 * ts/no-ts-ignore: reports @ts-ignore and @ts-nocheck directives in comments of script code. The words inside a
 * string are not a directive and are not reported.
 */
import { blank, scriptBlocks } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const block of scriptBlocks(ctx)) {
      const code = blank(block.text)
      const re = /@ts-(ignore|nocheck)\b/g
      for (const m of block.text.matchAll(re)) {
        const lineStart = block.text.lastIndexOf('\n', m.index) + 1
        const prefix = block.text.slice(lineStart, m.index)
        if (code[m.index] !== ' ' || !/(?:\/\/|\/\*|^\s*\*)\s*$/.test(prefix)) continue
        ctx.report(ctx.lineOf(block.offset + m.index), `Replace @ts-${m[1]} with @ts-expect-error and the reason.`)
      }
    }
  }
}
