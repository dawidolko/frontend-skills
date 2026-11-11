/*
 * astro/public-env-secret: in an Astro project, reports PUBLIC_ variable names in code that say they hold a secret
 * (SECRET, PRIVATE, PASSWORD, PASSWD, SERVICE_ROLE). Next.js names (NEXT_PUBLIC_) are left to next/public-env-secret.
 */
import { findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$])PUBLIC_\w*?(?:SECRET|PRIVATE|PASSWORD|PASSWD|SERVICE_ROLE)\w*/g))
      ctx.report(ctx.lineOf(f.index), `${f.match[0]} is built into client code; drop the PUBLIC_ prefix and import it from astro:env/server.`)
  }
}
