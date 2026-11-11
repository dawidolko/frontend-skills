---
id: ts/no-ts-ignore
title: Silence a type error with @ts-expect-error and a reason, never @ts-ignore or @ts-nocheck.
severity: minor
check: static
applies:
  - jsx
  - vue
  - svelte
  - astro
stack:
  - typescript
skill: fe-typescript
since: 0.1.0
sources:
  - title: TypeScript 3.9 release notes (ts-expect-error comments)
    url: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments
  - title: typescript-eslint, ban-ts-comment
    url: https://typescript-eslint.io/rules/ban-ts-comment/
---

## Why

`@ts-ignore` hides every error on the next line, including the new ones a later change introduces, and stays forever after the original problem is fixed. `@ts-nocheck` does the same for a whole file. Nobody knows why it is there or whether it is still needed.

## Fix

Fix the type. When that is not possible today, use `// @ts-expect-error <why, and when it can go>`: it hides the error and itself fails as soon as the error disappears, so it is removed on time.

## Examples

```ts
// bad
// @ts-ignore
chart.render(data)
// good
// @ts-expect-error chart.js 4 types lack the plugin option; remove after upgrading to 5
chart.render(data, { plugins })
```
