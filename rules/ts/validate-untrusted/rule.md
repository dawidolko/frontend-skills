---
id: ts/validate-untrusted
title: Data from outside the program (fetch, JSON.parse, storage) is validated at run time, not given a type with as or an annotation.
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
  - title: TypeScript handbook, More on functions (unknown, the JSON.parse example)
    url: https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown
  - title: TypeScript handbook, Narrowing
    url: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
---

## Why

Types are erased at build time. `(await res.json()) as User` does not check anything: when the API renames a field or returns an error object, the code reads `undefined` deep inside a component, far from the cause. The cast also tells the reader the data was checked when it was not.

## Fix

Treat the value as `unknown` and validate it once where it enters: a schema (Valibot, Zod Mini, or the validator the project already uses) that returns typed data or throws, or a hand-written type guard for a small shape. Pass the checked value inward; inner code then needs no casts.

## Examples

```ts
// bad
const user = (await res.json()) as User
const settings: Settings = JSON.parse(localStorage.getItem('settings') ?? '{}')
// good
const user = v.parse(UserSchema, await res.json())
const settings = v.parse(SettingsSchema, JSON.parse(localStorage.getItem('settings') ?? '{}'))
```
