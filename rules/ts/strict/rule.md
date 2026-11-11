---
id: ts/strict
title: TypeScript runs with strict on; no config turns strict or one of its checks (strictNullChecks, noImplicitAny...) off.
severity: moderate
check: static
applies:
  - project
stack:
  - typescript
skill: fe-typescript
since: 0.1.0
sources:
  - title: TypeScript, TSConfig reference (strict)
    url: https://www.typescriptlang.org/tsconfig/#strict
  - title: Announcing TypeScript 6.0 (strict is on by default)
    url: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
---

## Why

Without `strictNullChecks`, every value may silently be `null` or `undefined` and the compiler never says so; without `noImplicitAny`, untyped parameters turn checking off where it matters most. Most "Cannot read properties of undefined" errors in production are what strict mode reports at build time.

## Fix

Remove `"strict": false` and any strict flag set to `false`. TypeScript 6.0 and later turn `strict` on by default; on 5.x write `"strict": true`. In a large old codebase, turn it on and silence the existing errors file by file with `// @ts-expect-error` and a reason, so new code is strict from today.

## Examples

```jsonc
// bad
{ "compilerOptions": { "strict": false } }
{ "compilerOptions": { "strict": true, "strictNullChecks": false } }
// good
{ "compilerOptions": { "strict": true, "noUncheckedIndexedAccess": true } }
```
