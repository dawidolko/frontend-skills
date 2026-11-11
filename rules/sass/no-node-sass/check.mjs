/*
 * sass/no-node-sass: a project check that reports node-sass in the dependencies of the root package.json and of
 * the nearest package.json of every listed file, at the line that declares it.
 */
import { hasDep, lineOfMatch, packages } from '../../tailwind/tw.mjs'

export default {
  check(ctx) {
    for (const p of packages(ctx))
      if (hasDep(p.pkg, 'node-sass'))
        ctx.report({ file: p.path, line: lineOfMatch(p.text, /"node-sass"\s*:/) }, 'node-sass is deprecated LibSass; install sass (or sass-embedded) instead.')
  }
}
