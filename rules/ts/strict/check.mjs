/*
 * ts/strict: reads the project's tsconfig files and reports "strict": false or any check that strict turns on
 * set to false. A config with no "strict" is reported only when it extends nothing, compiles files itself and the
 * project asks for TypeScript 5 or older (strict became the default in 6.0); with "extends" the base may set it.
 */
import { isSolution, lineOfKey, tsconfigs, typescriptMajor } from '../tsconfig.mjs'

const FLAGS = [
  'strict',
  'noImplicitAny',
  'strictNullChecks',
  'strictFunctionTypes',
  'strictBindCallApply',
  'strictPropertyInitialization',
  'strictBuiltinIteratorReturn',
  'noImplicitThis',
  'useUnknownInCatchVariables',
  'alwaysStrict'
]

export default {
  check(ctx) {
    for (const cfg of tsconfigs(ctx)) {
      const options = cfg.data.compilerOptions || {}
      for (const flag of FLAGS)
        if (options[flag] === false)
          ctx.report({ file: cfg.path, line: lineOfKey(cfg.text, flag) }, `"${flag}": false turns off strict type checking; remove it.`)
      if (options.strict !== undefined || cfg.data.extends || isSolution(cfg.data)) continue
      const major = typescriptMajor(ctx, cfg.path)
      if (major !== null && major < 6)
        ctx.report({ file: cfg.path, line: lineOfKey(cfg.text, 'compilerOptions') }, `TypeScript ${major} is not strict by default; add "strict": true.`)
    }
  }
}
