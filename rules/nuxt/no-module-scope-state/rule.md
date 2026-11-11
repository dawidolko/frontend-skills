---
id: nuxt/no-module-scope-state
title: Never create ref() or reactive() state at module scope in a Nuxt app; use useState or a Pinia store.
severity: serious
check: static
applies:
  - vue
  - jsx
stack:
  - nuxt
skill: fe-nuxt
since: 0.1.0
sources:
  - title: Nuxt docs, State Management (never define const state = ref() outside setup)
    url: https://nuxt.com/docs/4.x/getting-started/state-management
  - title: Vue docs, Server-Side Rendering (cross-request state pollution)
    url: https://vuejs.org/guide/scaling-up/ssr
---

## Why

A module is loaded once per server process and shared by every request it serves. `export const user = ref(null)` in a composable file therefore holds the last visitor's data for the next one: one user can see another user's name, cart or token in server-rendered HTML, and the value never gets freed.

## Fix

Create state inside a function that runs per request: `export const useUser = () => useState('user', () => null)`, or a Pinia store (`defineStore`), which Nuxt creates per request. A plain `<script>` block of a `.vue` file is module scope too; `<script setup>` is per component. Client-only files (`*.client.ts` plugins) may keep module state.

## Examples

```js
// bad (composables/user.js)
export const user = ref(null)
// good
export const useUser = () => useState('user', () => null)
```
