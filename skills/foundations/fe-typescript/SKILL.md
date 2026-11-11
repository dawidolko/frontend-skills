---
name: fe-typescript
description: Writes and reviews TypeScript for front-end apps (TypeScript 7, React, Vue, Svelte, Angular, Astro) - strict config, no any, types checked at the boundaries (API, storage, forms), narrowing instead of casts, a tsconfig that builds on 6 and 7. Use when editing .ts or .tsx files or a tsconfig, upgrading TypeScript, or when asked to type an API response or review types.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: TypeScript
  area: foundations
  lane: B
  requires: typescript
  globs: "**/*.ts **/*.tsx **/*.mts **/*.cts **/tsconfig*.json"
  rules: "ts/strict ts/no-deprecated-options ts/isolated-modules ts/no-explicit-any ts/validate-untrusted ts/no-ts-ignore"
  version: 0.1.0
---

# TypeScript

Read `.frontend-skills/profile.json` (TypeScript version, framework, validator in use) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Keep `strict` on; never set it or one of its flags to `false` (ts/strict).
- Use no option removed in TypeScript 7: `baseUrl`, `moduleResolution: "node"`, `target: "es5"`, `outFile` (ts/no-deprecated-options).
- With Vite or another per-file compiler, set `verbatimModuleSyntax` and write `import type` (ts/isolated-modules).
- Never write `any`: use the real type, a generic, or `unknown` and narrow it (ts/no-explicit-any).
- Validate data from `fetch`, `JSON.parse`, storage, `postMessage` and URLs at run time; never type it with `as` (ts/validate-untrusted).
- Silence an error only with `@ts-expect-error` and a reason, never `@ts-ignore` (ts/no-ts-ignore).
- Narrow with `typeof`, `instanceof`, `in` and type guards instead of `as` casts and `!` assertions.
- Model states as discriminated unions (`{ status: 'error'; error: Error }`) and end a `switch` over them with a `never` check.
- Infer local types; annotate exported functions, component props and module boundaries.

## Do this

1. Check the version in the profile. On TypeScript 7 (`tsc` is the native compiler, no programmatic API until 7.1), tools that import `typescript` (typescript-eslint, `vue-tsc`, `svelte-check`, Astro, MDX) need 6.0 through the alias `typescript@npm:@typescript/typescript6`; keep TS 7 as `@typescript/native` for `tsc`.
2. Start a browser app's tsconfig from `"module": "esnext"`, `"moduleResolution": "bundler"`, `"verbatimModuleSyntax": true`, `"noUncheckedIndexedAccess": true`, and list global types in `"types"` (it defaults to `[]` since 6.0, so `vite/client` or `node` must be named).
3. Put one schema per external shape next to the call (Valibot or Zod Mini, or the validator already in the project); derive the type from it (`v.InferOutput<typeof User>`), so type and check cannot drift.
4. Type props and events in the framework's way: React `ComponentProps<'button'>`, Vue `defineProps<Props>()`, Svelte `let { a }: Props = $props()`, Angular `input.required<T>()`.
5. Prefer `satisfies` to check a literal against a type without widening it; `as const` objects instead of `enum` when code runs through type stripping.
6. Type-check in CI with `tsc --noEmit` (or the framework's checker): bundlers only strip types.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reads the tsconfig files (strict, removed options, isolated modules) and `.tsx`, Vue, Svelte and Astro scripts (`any`, unchecked casts, `@ts-ignore`). Plain `.ts` files are not read by the audit yet; run the linter on them.
- Lint with typescript-eslint's typed config (`no-explicit-any`, `no-floating-promises`, `no-unsafe-*`, `ban-ts-comment`).

## References

- [references/typescript.md](references/typescript.md): tsconfig for 6 and 7, the strict family, boundary validation with validators compared, narrowing patterns and framework typing. Read it for a new tsconfig, a TypeScript upgrade or typing API data.
