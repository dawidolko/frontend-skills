/*
 * sass/no-extend-class: reports @extend whose target is not a placeholder selector (%name). @extend %name and
 * comments are left out.
 */
import { findInScss } from '../scss.mjs'

export default {
  check(ctx) {
    for (const f of findInScss(ctx, /@extend\s+([^;{}]+)/g)) {
      const target = f.match[1].replace(/!optional/, '').trim()
      if (target.split(',').every((t) => t.trim().startsWith('%'))) continue
      ctx.report(ctx.lineOf(f.index), `@extend ${target} extends a real selector; extend a %placeholder or use a mixin.`)
    }
  }
}
