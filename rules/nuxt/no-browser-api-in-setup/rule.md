---
id: nuxt/no-browser-api-in-setup
title: Never touch window, document, localStorage or navigator at the top of script setup; it also runs on the server.
severity: serious
check: static
applies:
  - vue
stack:
  - nuxt
skill: fe-nuxt
since: 0.1.0
sources:
  - title: Nuxt docs, Hydration best practices (browser-only APIs in server context)
    url: https://nuxt.com/docs/4.x/guide/best-practices/hydration
  - title: Vue docs, Server-Side Rendering (access to platform-specific APIs)
    url: https://vuejs.org/guide/scaling-up/ssr
---

## Why

With server rendering, `<script setup>` runs first on the server, where `window`, `document` and `localStorage` do not exist: the page answers with a 500 error, or, when the access is guarded badly, the server and browser render different HTML and hydration throws the server's markup away.

## Fix

Read browser state after mounting (`onMounted(() => { theme.value = localStorage.getItem('theme') })`), guard with `if (import.meta.client)`, use a cookie that both sides can read (`useCookie('theme')`), or render the part only in the browser (`<ClientOnly>` or a `*.client.vue` component).

## Examples

```js
// bad
const theme = ref(localStorage.getItem('theme') ?? 'light')
// good
const theme = useCookie('theme', { default: () => 'light' })
```
