---
id: tooling/typecheck-separately
title: A TypeScript project runs a separate type check (tsc --noEmit, vue-tsc, svelte-check, astro check) in CI; the bundler does not.
severity: moderate
check: manual
applies:
  - project
stack:
  - typescript
skill: fe-tooling
since: 0.1.0
sources:
  - title: Vite, Features (TypeScript transpile only)
    url: https://vite.dev/guide/features#typescript
  - title: TypeScript, TSConfig reference (noEmit)
    url: https://www.typescriptlang.org/tsconfig/#noEmit
---

## Why

Vite, esbuild, Rolldown, Turbopack and SWC remove types without checking them, so a build succeeds with type errors and they reach production. Editors show errors only in open files.

## Fix

Add a `typecheck` script and run it in CI next to lint and tests: `tsc --noEmit` (or `tsc -b` for project references), `vue-tsc --noEmit` for Vue, `svelte-check` for Svelte, `astro check` for Astro, `ng build` for Angular. On TypeScript 7 (the native compiler, no programmatic API yet), tools that call the TypeScript API, such as type-aware typescript-eslint rules, `vue-tsc` and `svelte-check`, may need the `@typescript/typescript6` compatibility package; check their documentation.

## Examples

```json
{ "scripts": { "typecheck": "tsc --noEmit", "lint": "eslint .", "test": "vitest run" } }
```
