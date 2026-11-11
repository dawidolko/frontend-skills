---
name: fe-nuxt
description: Writes and reviews Nuxt 4 apps - useFetch and useAsyncData vs $fetch, keys, per-request state, server-safe setup, runtime config, route announcements - so pages render on the server without leaks, double requests or hydration errors. Use when editing files in a Nuxt project (app/, pages, composables, nuxt.config), fixing a hydration mismatch, or when asked to review Nuxt code.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Nuxt apps
  area: frameworks
  lane: B
  requires: nuxt
  globs: "**/*.vue app/**/*.ts app/**/*.js server/**/*.ts **/nuxt.config.ts **/nuxt.config.js **/nuxt.config.mjs"
  rules: "nuxt/no-bare-fetch-in-setup nuxt/fetch-composable-in-handler nuxt/async-data-key nuxt/no-module-scope-state nuxt/no-browser-api-in-setup nuxt/runtime-config-not-process-env nuxt/public-runtime-config nuxt/route-announcer vue/link-for-navigation js/asset-import"
  version: 0.1.0
---

# Nuxt apps

Read `.frontend-skills/profile.json` (Nuxt version, modules, rendering) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill. Everything in `fe-vue` applies too.

## Rules

- Load initial data with `useFetch`/`useAsyncData`, never a bare `$fetch` at the top of setup (nuxt/no-bare-fetch-in-setup).
- In event handlers use `$fetch`, then `refresh()`; never `useFetch` there (nuxt/fetch-composable-in-handler).
- Give `useAsyncData` in a composable a key built from its inputs (nuxt/async-data-key).
- No `ref`/`reactive` at module scope; `useState('key')` or a Pinia store (nuxt/no-module-scope-state).
- No `window`, `document`, `localStorage` at the top of setup; `onMounted`, `useCookie`, `<ClientOnly>` (nuxt/no-browser-api-in-setup).
- Read config with `useRuntimeConfig()` and test sides with `import.meta.client` (nuxt/runtime-config-not-process-env).
- Never put secrets under `runtimeConfig.public` (nuxt/public-runtime-config).
- Render `<NuxtRouteAnnouncer />` and give each page its own title (nuxt/route-announcer).
- Navigate with `<NuxtLink>` (vue/link-for-navigation); import assets or use `~/assets` (js/asset-import).
- Treat every hydration warning as a bug.

## Do this

1. Nuxt 4 layout: app code in `app/` (`pages/`, `layouts/`, `components/`, `composables/`, `middleware/`, `plugins/`, `app.vue`), API routes in `server/`, shared types in `shared/`, static files in `public/`. Nuxt 3 is end-of-life since 2026-07-31.
2. Data: `const { data, status, error, refresh } = await useFetch('/api/x', { pick: [...] })`; show `status === 'pending'` and `error` states; `lazy: true` for below-the-fold data; `Promise.all` inside one `useAsyncData` for parallel calls. `data` starts as `undefined`.
3. State shared across components: `useState('cart', () => [])` with JSON-serializable values, or Pinia (`@pinia/nuxt`).
4. Head and SEO per page: `useSeoMeta({ title, description })`, a `titleTemplate` in `app.vue`; `definePageMeta` takes only static values.
5. Rendering per route with `routeRules` (`prerender`, `swr`, `isr`, `ssr: false`); with `ssr: false` add `app/spa-loading-template.html`.
6. Images through `<NuxtImg>` (`@nuxt/image`), fonts through `@nuxt/fonts`, third-party scripts through `@nuxt/scripts`; `Lazy` prefix and `hydrate-on-visible` for heavy components below the fold.
7. Secrets only in server code: top-level `runtimeConfig` read with `useRuntimeConfig(event)` in `server/`, set with `NUXT_` variables.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports bare `$fetch` in setup, data composables in handlers, keyless `useAsyncData` in composables, module-scope state, browser APIs in setup, `process.env` in app code, public secrets and a missing route announcer.
- Run `@nuxt/eslint` (it includes `eslint-plugin-vue`) and `nuxi typecheck`.
- Load a page with JavaScript off and on, and read the browser console for hydration warnings; navigate with a screen reader to hear the announcer.

## References

- [references/nuxt.md](references/nuxt.md): data fetching options, state, rendering modes and route rules, hydration causes, runtime config, accessibility, performance modules, Nuxt 3 to 4 changes. Read it for data loading, a hydration bug, configuration or an upgrade.
