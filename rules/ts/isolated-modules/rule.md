---
id: ts/isolated-modules
title: A Vite project's tsconfig sets isolatedModules or verbatimModuleSyntax, so code the bundler compiles file by file type-checks the same way.
severity: minor
check: static
applies:
  - project
stack:
  - typescript
  - vite
skill: fe-typescript
since: 0.1.0
sources:
  - title: Vite, Features (TypeScript, isolatedModules)
    url: https://vite.dev/guide/features#isolatedmodules
  - title: TypeScript, TSConfig reference (verbatimModuleSyntax)
    url: https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax
---

## Why

Vite (through esbuild or Oxc) compiles each file alone and never type-checks. Features that need the whole program, such as `const enum` or an import of a type without `type`, compile in `tsc` but break or leave stray imports in the bundle. Without the flag, the editor and `tsc` stay silent about them.

## Fix

Add `"verbatimModuleSyntax": true` (which implies isolated modules and keeps imports exactly as written) or at least `"isolatedModules": true`, then write `import type { User } from './types'` for type-only imports. Run `tsc --noEmit` (or `vue-tsc`, `svelte-check`, `astro check`) in CI, since the build itself does not check types.

## Examples

```jsonc
// bad
{ "compilerOptions": { "module": "esnext", "moduleResolution": "bundler", "strict": true } }
// good
{ "compilerOptions": { "module": "esnext", "moduleResolution": "bundler", "strict": true, "verbatimModuleSyntax": true } }
```
