/*
 * nuxt/runtime-config-not-process-env: reports process.env, process.client, process.server and process.dev in the
 * scripts of .vue files and in .js/.jsx files of a Nuxt project. Server code (server/), configuration files
 * (*.config.*) and modules/ are left out, since they run in Node.js where process.env is right.
 */
import { findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    if (/(?:^|\/)(?:server|modules)\//.test(ctx.file) || /\.config\.[a-z]+$/i.test(ctx.file)) return
    for (const f of findInCode(ctx, /(?<![\w$.])process\s*\.\s*(env|client|server|dev|browser)\b/g)) {
      const what = f.match[1]
      const message =
        what === 'env'
          ? 'process.env is not available in the browser or from .env in production; use useRuntimeConfig().'
          : `Use import.meta.${what === 'browser' ? 'client' : what} instead of process.${what}.`
      ctx.report(ctx.lineOf(f.index), message)
    }
  }
}
