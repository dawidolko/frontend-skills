---
id: ts/no-explicit-any
title: Type values with a real type or unknown (then narrow), never any.
severity: moderate
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
  - title: TypeScript handbook, More on functions (unknown)
    url: https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown
  - title: TypeScript handbook, Everyday types (any and noImplicitAny)
    url: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any
---

## Why

`any` switches type checking off for the value and for everything it flows into: a typo in a property name, a missing `await` or a wrong argument all compile and fail at run time. One `any` in an API helper spreads to every component that uses its result.

## Fix

Use the real type, a generic, or `unknown` and narrow it before use (`typeof`, `instanceof`, `in`, a type guard, or a schema validator at the boundary). In `catch (err)`, leave the type off: with `strict` it is `unknown`. For a third-party gap, write a small declaration instead of `any`.

## Examples

```ts
// bad
function total(items: any) { return items.reduce((sum: any, i: any) => sum + i.price, 0) }
// good
function total(items: { price: number }[]) { return items.reduce((sum, i) => sum + i.price, 0) }
```
