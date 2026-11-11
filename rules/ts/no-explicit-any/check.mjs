/*
 * ts/no-explicit-any: reports the type any in TypeScript code (.tsx files, Vue and Svelte scripts with lang="ts",
 * Astro front matter): annotations, as any, generics such as Array<any> and Record<string, any>. The word must be
 * followed by what ends a type, so text in JSX ("Pick: any of these") is not taken for a type.
 */
import { findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?:[:<,|&]|\bas|=>)\s*any(?![\w$])(?=\s*(?:[;,)=\]|&>{}?]|\[\]|$))/gm)) {
      if (!f.ts) continue
      const at = f.index + f.match[0].lastIndexOf('any')
      ctx.report(ctx.lineOf(at), 'Replace any with a real type, or unknown and a check before use.')
    }
  }
}
