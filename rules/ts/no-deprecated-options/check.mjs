/*
 * ts/no-deprecated-options: in projects whose package.json asks for TypeScript 6 or later, reports tsconfig options
 * and values deprecated in 6.0 and removed in 7.0. alwaysStrict: false is left to ts/strict. Projects on 5.x or
 * with no typescript dependency are left out, since the options are still valid there.
 */
import { lineOfKey, tsconfigs, typescriptMajor } from '../tsconfig.mjs'

const lower = (v) => (typeof v === 'string' ? v.toLowerCase() : v)
const CHECKS = [
  ['target', (v) => ['es3', 'es5'].includes(lower(v)), 'use es2022 or later'],
  ['moduleResolution', (v) => ['node', 'node10', 'classic'].includes(lower(v)), 'use "bundler" (or "nodenext" for Node code)'],
  ['module', (v) => ['amd', 'umd', 'system', 'systemjs', 'none'].includes(lower(v)), 'use "esnext" (or "preserve")'],
  ['baseUrl', (v) => v !== undefined, 'write paths relative to the config instead'],
  ['downlevelIteration', (v) => v !== undefined, 'remove it'],
  ['outFile', (v) => v !== undefined, 'let the bundler produce one file'],
  ['esModuleInterop', (v) => v === false, 'remove it'],
  ['allowSyntheticDefaultImports', (v) => v === false, 'remove it']
]

export default {
  check(ctx) {
    for (const cfg of tsconfigs(ctx)) {
      const major = typescriptMajor(ctx, cfg.path)
      if (major === null || major < 6) continue
      const options = cfg.data.compilerOptions || {}
      for (const [key, bad, fix] of CHECKS)
        if (bad(options[key])) ctx.report({ file: cfg.path, line: lineOfKey(cfg.text, key) }, `"${key}"${typeof options[key] === 'string' ? `: "${options[key]}"` : ''} is removed in TypeScript 7; ${fix}.`)
    }
  }
}
