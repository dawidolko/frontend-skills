---
id: ts/no-deprecated-options
title: The tsconfig of a TypeScript 6 or 7 project uses no option deprecated in 6.0 and removed in 7.0 (baseUrl, moduleResolution node, target es5...).
severity: moderate
check: static
applies:
  - project
stack:
  - typescript
skill: fe-typescript
since: 0.1.0
sources:
  - title: Announcing TypeScript 6.0 (deprecations)
    url: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
  - title: Announcing TypeScript 7.0
    url: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
  - title: TypeScript, TSConfig reference (moduleResolution)
    url: https://www.typescriptlang.org/tsconfig/#moduleResolution
---

## Why

TypeScript 6.0 deprecated a set of options and values, and TypeScript 7.0 (the native compiler) no longer accepts them: a project that upgrades fails to build, and on 6.x every build warns. `moduleResolution: node` also resolves packages differently from the bundler, so imports type-check that fail at run time, and the other way round.

## Fix

For browser code built by a bundler: `"module": "esnext"`, `"moduleResolution": "bundler"`, a modern `target` (`es2022` or later). Replace `baseUrl` with `paths` entries relative to the config (`"@/*": ["./src/*"]`). Remove `downlevelIteration`, `outFile`, `esModuleInterop: false`, `allowSyntheticDefaultImports: false` and AMD, UMD or SystemJS modules.

## Examples

```jsonc
// bad
{ "compilerOptions": { "target": "es5", "moduleResolution": "node", "baseUrl": "." } }
// good
{ "compilerOptions": { "target": "es2022", "module": "esnext", "moduleResolution": "bundler", "paths": { "@/*": ["./src/*"] } } }
```
