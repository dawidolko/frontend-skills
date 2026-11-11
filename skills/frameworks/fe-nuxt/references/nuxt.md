# Nuxt reference

Depth for the `fe-nuxt` skill, for Nuxt 4 (latest stable on the npm registry, checked 2026-11-11: 4.6.4, built on Vue 3.5). Nuxt 3 reached end-of-life on 2026-07-31. Rule ids in brackets: `frontend-skills explain <id>`.

## Data fetching

| Need | Use | Notes |
| --- | --- | --- |
| Data a page or component renders on first load | `useFetch(url, options)` | Server result goes in the payload; no second request in the browser [nuxt/no-bare-fetch-in-setup] |
| Custom loader (several calls, an SDK) | `useAsyncData(key, () => ...)` | Explicit key in composables [nuxt/async-data-key] |
| Request started by the user (submit, click) | `$fetch(url, { method, body })` | Then `refresh()` or update state [nuxt/fetch-composable-in-handler] |
| Data not needed for the first paint | `lazy: true` or `useLazyFetch` | Render `status === 'pending'`; do not `await` and expect data |
| Smaller payload | `pick: ['id', 'name']`, `transform`, `serialize: false` (4.6) | Dev warns above 100 kB of payload (4.6) |
| Parallel calls | `useAsyncData('page', () => Promise.all([...]))` | Avoids a waterfall |
| Your own API during SSR with cookies | `useFetch` or `useRequestFetch()` | Bare `$fetch` on the server does not forward the browser's cookies |

Return value: `{ data, status, error, refresh, clear }`; `status` is `idle`, `pending`, `success` or `error`; `data` is `undefined` until resolved (or `default()`). Calls that share a key share `data`; keep their options identical. Never name your own function `useFetch` or `useAsyncData` (compiler-transformed); for presets use `createUseFetch`/`createUseAsyncData`.

```ts
export function useProduct(id: Ref<string>) {
  return useAsyncData(() => `product-${id.value}`, () => $fetch(`/api/products/${id.value}`), { watch: [id] })
}
```

## State

| Kind | Use |
| --- | --- |
| Per component | `ref`, `computed` in `<script setup>` |
| Shared, small, serializable | `useState('key', () => init)` (JSON only: no classes, functions, symbols) |
| Shared app state with actions | Pinia with `@pinia/nuxt` (created per request) |
| Never | `export const x = ref()` in a module [nuxt/no-module-scope-state] |

## Rendering and route rules

| Mode | Set with | For |
| --- | --- | --- |
| Universal (SSR + hydration) | default | Most pages |
| Prerendered | `routeRules: { '/blog/**': { prerender: true } }` | Content that changes at build |
| Stale-while-revalidate / ISR | `{ swr: 3600 }`, `{ isr: true }` | Content that changes now and then |
| Client only | `{ ssr: false }` or `ssr: false` globally | Dashboards behind sign-in; add `spa-loading-template.html` |

Components: `*.client.vue` render only in the browser, `<ClientOnly>` wraps a part; `Lazy` prefix splits the code; `hydrate-on-visible`, `hydrate-on-idle`, `hydrate-on-interaction` delay hydration (never on above-the-fold content; `hydrate-never` only for static content). `*.server.vue` server components are experimental.

## Hydration mismatches

| Cause | Fix |
| --- | --- |
| `localStorage`, `window` in setup [nuxt/no-browser-api-in-setup] | `useCookie`, `onMounted`, `import.meta.client` guard |
| `Math.random()`, ids made in render | `useState` for shared values, `useId()` for ids |
| `v-if="window.innerWidth > 768"` | CSS media or container queries |
| Time of day, relative dates | `<NuxtTime>`, or `<ClientOnly>` and set in `onMounted` |
| Third-party scripts that edit the DOM | Initialise in `onMounted` or with `@nuxt/scripts` |
| iOS Safari turning phone numbers into links | `format-detection` meta in `app.head`, or real `tel:` links |

## Runtime config

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    stripeSecretKey: '',            // server only: NUXT_STRIPE_SECRET_KEY
    public: { apiBase: '/api' }     // sent to every browser: NUXT_PUBLIC_API_BASE
  }
})
```

- Read with `useRuntimeConfig()` in app code, `useRuntimeConfig(event)` in `server/` [nuxt/runtime-config-not-process-env].
- Only browser-safe values under `public` [nuxt/public-runtime-config].
- Override in production with matching `NUXT_` and `NUXT_PUBLIC_` variables; `.env` is read in development only and stays out of git.
- `useSession` and modules that sign data need `NUXT_APP_SECRET` (4.6) in every deployed environment.

## Accessibility

- `<NuxtRouteAnnouncer />` in `app.vue` or every layout [nuxt/route-announcer]; a distinct title per page with `useSeoMeta`; a `titleTemplate` for the site name.
- `useRouteAnnouncer().set(message)` (or the announcer added in 4.4) for in-page updates such as search results.
- `<NuxtLink>` for navigation [vue/link-for-navigation]; `external` for files in `public/` and other apps; set `aria-current` yourself on links that differ only by query.
- A skip link to `#main` as the first tab stop; move focus to `<main tabindex="-1">` or the page heading after navigation (a client plugin on `page:finish`).
- `@nuxt/a11y` (axe-core in DevTools) is an alpha; automated checks find only part of the problems.

## Performance

| Area | Use |
| --- | --- |
| Images | `<NuxtImg>`/`<NuxtPicture>` with `sizes`; `:preload="{ fetchPriority: 'high' }"` only on the LCP image |
| Fonts | `@nuxt/fonts` (self-hosted, metric-matched fallbacks) instead of a third-party stylesheet |
| Scripts | `@nuxt/scripts` to load analytics and widgets after hydration |
| Plugins | Few and cheap; `parallel: true` for async ones; prefer composables |
| Bundles | `nuxi analyze`, Nuxt DevTools; `Lazy` components behind `v-if` |

## Nuxt 3 to 4 changes still met

| Nuxt 3 | Nuxt 4 |
| --- | --- |
| `pages/`, `components/` at the root | under `app/` (the default `srcDir`); `server/`, `public/`, `shared/` stay at the root; the old layout is still detected |
| `data` defaulted to `null` | `undefined` until the data arrives |
| Same-key calls could differ in options | Calls sharing a key share refs; `deep`, `transform`, `pick`, `getCachedData` and `default` must match |

`process.client` and `process.server` are older spellings of `import.meta.client` and `import.meta.server`; `@nuxt/eslint` prefers the latter (`nuxt/prefer-import-meta`).

## Sources

- Nuxt docs, Data Fetching: https://nuxt.com/docs/4.x/getting-started/data-fetching
- Nuxt docs, useFetch: https://nuxt.com/docs/4.x/api/composables/use-fetch
- Nuxt docs, useAsyncData: https://nuxt.com/docs/4.x/api/composables/use-async-data
- Nuxt docs, $fetch: https://nuxt.com/docs/4.x/api/utils/dollarfetch
- Nuxt docs, State Management: https://nuxt.com/docs/4.x/getting-started/state-management
- Nuxt docs, Rendering Modes: https://nuxt.com/docs/4.x/guide/concepts/rendering
- Nuxt docs, Hydration best practices: https://nuxt.com/docs/4.x/guide/best-practices/hydration
- Nuxt docs, Runtime Config: https://nuxt.com/docs/4.x/guide/going-further/runtime-config
- Nuxt docs, .env: https://nuxt.com/docs/4.x/directory-structure/env
- Nuxt docs, Accessibility: https://nuxt.com/docs/4.x/guide/best-practices/accessibility
- Nuxt docs, NuxtRouteAnnouncer: https://nuxt.com/docs/4.x/api/components/nuxt-route-announcer
- Nuxt docs, Performance: https://nuxt.com/docs/4.x/guide/best-practices/performance
- Nuxt docs, Upgrade guide: https://nuxt.com/docs/4.x/getting-started/upgrade
- Nuxt blog, Nuxt 4.6: https://nuxt.com/blog/v4-6
