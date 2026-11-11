/*
 * next/public-env-secret: reports NEXT_PUBLIC_ variable names in code that say they hold a secret (SECRET,
 * PRIVATE, PASSWORD, PASSWD, SERVICE_ROLE). Names of keys that are public by design (PUBLISHABLE, ANON, an API key
 * id) are not matched; names in comments and strings are not code.
 */
import { findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /\bNEXT_PUBLIC_\w*?(?:SECRET|PRIVATE|PASSWORD|PASSWD|SERVICE_ROLE)\w*/g))
      ctx.report(ctx.lineOf(f.index), `${f.match[0]} is inlined into the browser bundle; drop the NEXT_PUBLIC_ prefix and read it on the server.`)
  }
}
