/*
 * ts/isolated-modules: in a project whose nearest package.json depends on vite, reports a tsconfig that compiles
 * files itself (not solution-style), extends nothing and sets neither isolatedModules nor verbatimModuleSyntax.
 * A config with "extends" is left out, since framework bases (@vue/tsconfig, astro, SvelteKit) set the flag.
 */
import { isSolution, lineOfKey, packageOf, tsconfigs } from '../tsconfig.mjs'

export default {
  check(ctx) {
    for (const cfg of tsconfigs(ctx)) {
      if (cfg.data.extends || isSolution(cfg.data)) continue
      const options = cfg.data.compilerOptions || {}
      if (options.isolatedModules === true || options.verbatimModuleSyntax === true) continue
      const pkg = packageOf(ctx, cfg.path)
      if (!pkg?.devDependencies?.vite && !pkg?.dependencies?.vite) continue
      ctx.report(
        { file: cfg.path, line: lineOfKey(cfg.text, 'compilerOptions') },
        'Vite compiles each file alone; add "verbatimModuleSyntax": true (or "isolatedModules": true).'
      )
    }
  }
}
