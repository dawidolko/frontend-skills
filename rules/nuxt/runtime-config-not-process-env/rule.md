---
id: nuxt/runtime-config-not-process-env
title: App code reads configuration with useRuntimeConfig() and tests the side with import.meta.client, not process.env or process.client.
severity: moderate
check: static
applies:
  - vue
  - jsx
stack:
  - nuxt
skill: fe-nuxt
since: 0.1.0
sources:
  - title: Nuxt docs, Runtime Config
    url: https://nuxt.com/docs/4.x/guide/going-further/runtime-config
  - title: Nuxt docs, .env (not read in production)
    url: https://nuxt.com/docs/4.x/directory-structure/env
---

## Why

`process.env` does not exist in the browser bundle and, on the server, `.env` is read only in development: `process.env.API_URL` in a component is `undefined` in the browser and in production unless the platform sets it, so the bug appears only after deploy. Runtime config is set once, overridable with `NUXT_` variables, and typed.

## Fix

Declare the value in `nuxt.config` under `runtimeConfig` (`public` only when the browser needs it) and read it with `useRuntimeConfig()`: `useRuntimeConfig().public.apiBase`. Set it in production with `NUXT_PUBLIC_API_BASE`. Test the side with `import.meta.client`, `import.meta.server` and `import.meta.dev`.

## Examples

```js
// bad
const api = process.env.API_URL
if (process.client) track()
// good
const api = useRuntimeConfig().public.apiBase
if (import.meta.client) track()
```
