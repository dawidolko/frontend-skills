# Nuxt: sources and candidate rules

Read on 2026-11-11. Primary sources:

- npm registry: https://www.npmjs.com/package/nuxt (JSON https://registry.npmjs.org/nuxt), https://www.npmjs.com/package/@nuxt/eslint, https://www.npmjs.com/package/@nuxt/eslint-config, https://www.npmjs.com/package/@nuxt/eslint-plugin (rule names read from the 1.17.0 tarball), https://www.npmjs.com/package/@nuxt/a11y, https://www.npmjs.com/package/@nuxt/image, https://www.npmjs.com/package/@nuxt/fonts, https://www.npmjs.com/package/@nuxt/scripts, https://www.npmjs.com/package/@nuxt/hints
- Nuxt blog: https://nuxt.com/blog, Nuxt 4.6 post https://nuxt.com/blog/v4-6 (2026-10-05)
- Docs (v4.x; every page has a Markdown twin under `https://nuxt.com/raw/docs/4.x/<path>.md`): Directory Structure https://nuxt.com/docs/4.x/directory-structure, nuxt.config https://nuxt.com/docs/4.x/directory-structure/nuxt-config, `.env` https://nuxt.com/docs/4.x/directory-structure/env, Components https://nuxt.com/docs/4.x/directory-structure/app/components, Data Fetching https://nuxt.com/docs/4.x/getting-started/data-fetching, `useFetch` https://nuxt.com/docs/4.x/api/composables/use-fetch, `$fetch` https://nuxt.com/docs/4.x/api/utils/dollarfetch, State Management https://nuxt.com/docs/4.x/getting-started/state-management, `useState` https://nuxt.com/docs/4.x/api/composables/use-state, Rendering Modes https://nuxt.com/docs/4.x/guide/concepts/rendering, Server Components https://nuxt.com/docs/4.x/guide/concepts/server-components, Runtime Config https://nuxt.com/docs/4.x/guide/going-further/runtime-config, Best practices: Accessibility https://nuxt.com/docs/4.x/guide/best-practices/accessibility, Hydration https://nuxt.com/docs/4.x/guide/best-practices/hydration, Performance https://nuxt.com/docs/4.x/guide/best-practices/performance, Plugins https://nuxt.com/docs/4.x/guide/best-practices/plugins, `<NuxtRouteAnnouncer>` https://nuxt.com/docs/4.x/api/components/nuxt-route-announcer, AI: https://nuxt.com/docs/4.x/guide/ai/llms-txt and https://nuxt.com/docs/4.x/guide/ai/mcp, ESLint module https://nuxt.com/modules/eslint

Nuxt is Vue: every rule in `vue.md` applies too. This file holds only what Nuxt adds or changes.

## Version (verified 2026-11-11)

| package | latest stable | published (registry `time`) | licence | notes |
|---|---|---|---|---|
| `nuxt` | **4.6.4** | 2026-11-02 | MIT | 4.6.0 published 2026-10-05 (blog "Nuxt 4.6", 2026-10-05); 4.0.0 2025-07-15. Depends on `vue ^3.5.44`; engines `node ^22.22.3 || ^24.15.0 || >=26.0.0`. **Nuxt 3 reached end-of-life on July 31, 2026** (4.6 post); last 3.x on npm 3.21.11. |
| `@nuxt/eslint` | **1.17.0** | 2026-08-06 | MIT | module; generates a project-aware flat config; ESLint 9/10 |
| `@nuxt/eslint-config` / `@nuxt/eslint-plugin` | 1.17.0 | 2026-08-06 | MIT | config depends on `eslint-plugin-vue`, `typescript-eslint`, `eslint-plugin-import-x`, `eslint-plugin-jsdoc`, `eslint-plugin-unicorn`, `eslint-plugin-regexp`, `@stylistic/eslint-plugin` (package.json deps) |
| `@nuxt/a11y` | **1.0.0-alpha.1** (only release; `latest` tag points at the alpha) | 2026-01-07 | MIT | docs: "in alpha, so expect its API to change" |
| `@nuxt/image` | 2.2.1 | 2026-10-30 | MIT | `<NuxtImg>` |
| `@nuxt/fonts` | 1.2.0 | 2026-10-25 | MIT | |
| `@nuxt/scripts` | 1.3.12 | 2026-10-03 | MIT | |
| `@nuxt/hints` | 1.1.5 | 2026-10-11 | MIT | dev hints for performance, security, etc. (package description; docs not read) |

4.6 highlights (blog): Vue Vapor support in interop mode (needs Vue 3.6 RC2+; Vue 3.6 is not stable on npm today), rebuilt typed `$fetch` (opt-in `experimental.routeTypedFetch`), `runtimeConfig.appSecret` / `NUXT_APP_SECRET` and `useSession` in `nuxt/server`, `serialize: false` for data composables, payload > 100 kB dev warning, `future.compatibilityVersion: 5` to try Nuxt 5 defaults. Security patch releases: blog "Nuxt Security Patch Releases" (2026-07-27: 4.5.1, 3.21.10, `@nuxt/devtools` 3.3.1).

## Stack detection

| signal | meaning |
|---|---|
| `nuxt` in `dependencies`/`devDependencies` | Nuxt (high); major from version: `4.x` current, `3.x` EOL, `2.x` legacy |
| `nuxt.config.ts` / `.js` / `.mjs` at root (docs: "extension can either be `.js`, `.ts` or `.mjs`"); `.nuxtrc` | Nuxt config |
| `app/` with `app.vue`, `pages/`, `layouts/`, `components/`, `composables/`, `middleware/`, `plugins/`, `utils/`, `app.config.ts`, `error.vue` | Nuxt 4 directory layout (srcDir `app/`) |
| `server/` (API routes, Nitro), `shared/`, `public/`, `layers/`, `modules/`, `content/` | server code, shared code, static files, layers, local modules, Nuxt Content |
| `.nuxt/`, `.output/` | generated build dirs (ignore when scanning) |
| `*.client.vue` / `*.server.vue` components; `Lazy*` component usage; `hydrate-on-*` / `hydrate-never` attrs | client-only, server components (experimental), lazy loading / lazy hydration |
| `ssr: false` in nuxt.config | SPA mode; `routeRules` with `prerender`, `swr`, `isr` | hybrid rendering |
| `modules: [...]` containing `@nuxt/eslint`, `@nuxt/image`, `@nuxt/fonts`, `@nuxt/scripts`, `@nuxt/a11y`, `@nuxt/hints` | which official tools are already in place |
| `eslint.config.mjs` importing `./.nuxt/eslint.config.mjs` and `withNuxt(` | `@nuxt/eslint` flat config in use |

## Static check: @nuxt/eslint 1.17.0

Setup: add `'@nuxt/eslint'` to `modules`; your `eslint.config.mjs` imports `./.nuxt/eslint.config.mjs` and wraps custom configs in `withNuxt(...)`; legacy `.eslintrc` is not supported (https://nuxt.com/modules/eslint). It brings `eslint-plugin-vue` (so `vue.md` lint rules apply) plus TS/import rules.

Nuxt-specific rules in `@nuxt/eslint-plugin` 1.17.0 (tarball): `nuxt/prefer-import-meta` (use `import.meta.*` over `process.*`), `nuxt/no-page-meta-runtime-values` (no runtime values in `definePageMeta`, which is extracted at build), `nuxt/nuxt-config-keys-order`, `nuxt/no-nuxt-config-test-key`. Rule prefix `nuxt/` assumed from the plugin name (see Not verified).

## Data fetching

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `nuxt/no-bare-fetch-in-setup` | Load initial page/component data with `useFetch` or `useAsyncData`, not bare `$fetch` in `<script setup>`. | Bare `$fetch` runs on server and again on client: double request, hydration issues, slower interactivity, no dedupe. | Data Fetching, "The Need for useFetch and useAsyncData" and `$fetch` warning | Nuxt | static: `await $fetch(` at top level of `<script setup>` (not inside a function/handler) | `const d = await $fetch('/api/x')` → `const { data } = await useFetch('/api/x')` | – | error |
| `nuxt/fetch-for-events` | Use `$fetch` for user-triggered requests (submit, click), not `useFetch`. | `useFetch` is meant for setup/lifecycle top level; in handlers it misbehaves. | Data Fetching, "Client-only fetching" note; `$fetch` warning | Nuxt | static: `useFetch(`/`useAsyncData(` inside a function called from an event handler | `onSubmit(){ useFetch() }` → `$fetch` | – | error |
| `nuxt/explicit-async-data-key` | Give `useAsyncData` an explicit, unique string key, especially inside custom composables. | Auto keys depend on call location; wrappers collide or fail to share. | Data Fetching, `useAsyncData` note and "Keys" | Nuxt | static: `useAsyncData(` whose first argument is a function, inside a `use*` composable | `useAsyncData(() => …)` → `useAsyncData('users', () => …)` | – | warning |
| `nuxt/shared-key-same-options` | Calls sharing a key must use the same `deep`, `transform`, `pick`, `getCachedData`, `default` and related options; use different keys for independent instances. | Shared refs; inconsistent options give undefined behaviour (dev warns). | Data Fetching, "Shared State and Option Consistency" | Nuxt | static: same literal key with differing option objects | – | – | warning |
| `nuxt/usefetch-shared-needs-key` | To share one `useFetch` result across components, pass the same explicit `key`; same URL alone gives separate requests. | Keys include call location. | Data Fetching, "Keys" | Nuxt | manual | – | – | info |
| `nuxt/lazy-not-await` | For non-blocking loading use `lazy: true` / `useLazyFetch` and handle `status`; don't `await` a lazy call expecting it to wait on client navigation. | On client navigation an awaited lazy call resolves before data arrives. | Data Fetching, "A note on await" (warning) | Nuxt | static: `await useLazyFetch(` or `await useFetch(…, { lazy: true })` followed by direct `data.value` use | – | – | warning |
| `nuxt/pick-payload` | Trim what goes into the HTML payload with `pick`/`transform`, or `serialize: false` (4.6) for data not needed after hydration. | Large payloads slow every page; dev warns above 100 kB (4.6). | Data Fetching, "Minimize payload size"; blog 4.6 | Nuxt | runtime: payload size; static: `useFetch` of list endpoints without `pick` (info) | – | – | info |
| `nuxt/parallel-requests` | Run independent requests together with `Promise.all` inside one `useAsyncData`. | Avoids waterfalls. | Data Fetching, "Making parallel requests" | Nuxt | static (heuristic): consecutive awaited `useFetch` with no dependency | – | – | info |
| `nuxt/no-reserved-composable-names` | Don't name your own functions `useFetch` or `useState`, and don't import `useFetch` from `@vueuse/core` in Nuxt; use `createUseFetch` for presets. | They are compiler-transformed reserved names; the VueUse import returns strings. | `useFetch` warnings; `useState` warning | Nuxt | static: `function useFetch`/`const useState =`/`import { useFetch } from '@vueuse/core'` | – | – | error |
| `nuxt/forward-cookies-ssr` | When calling your own API with `$fetch` during SSR, forward needed headers (or use `useRequestFetch`/`useFetch`, which do it). | Server-side calls don't carry the browser's cookies automatically. | Data Fetching, "Pass Client Headers to the API" | Nuxt | manual | – | – | info |

## State

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `nuxt/no-module-scope-state` | Never create `ref()`/`reactive()` state at module scope (`export const x = ref()`); use `useState('key')` or Pinia. | Shared across server requests: data leaks between users and memory leaks. | State Management (warning); Vue SSR #cross-request-state-pollution | Nuxt | static: top-level `ref(`/`reactive(` in `composables/`, `utils/`, `stores/` outside functions | `export const user = ref()` → `export const useUser = () => useState('user')` | – | error |
| `nuxt/usestate-serializable` | Keep only JSON-serializable data in `useState` (no classes, functions, symbols). | It is serialized into the payload. | `useState` important note | Nuxt | static (heuristic): `useState(…, () => new X())` | – | – | error |

## Rendering modes, hydration and components

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `nuxt/fix-hydration-warnings` | Treat every hydration warning as a bug to fix, not noise. | Re-rendering hurts TTI, causes layout shift, broken handlers, SEO drift. | Hydration best practices | Nuxt | runtime: dev console hydration warnings | – | – | error |
| `nuxt/no-browser-api-in-ssr` | Don't read `window`, `document`, `localStorage` in setup/render; use `useCookie`, `onMounted`, `.client` components or `<ClientOnly>`. | Server has no browser APIs; output differs. | Hydration, "Browser-only APIs in Server Context" | Nuxt | static: `localStorage`/`window.` at `<script setup>` top level | `localStorage.getItem('theme')` → `useCookie('theme')` | – | error |
| `nuxt/ssr-consistent-data` | Don't render random or time-based values directly; use `useState` for shared values and `<NuxtTime>` or client-only rendering for time. | Server/client output differs. | Hydration, "Inconsistent Data", "Dynamic Content Based on Time" | Nuxt | static: `Math.random()`/`new Date()` in templates/setup | `{{ new Date().toLocaleString() }}` → `<NuxtTime :datetime>` | – | warning |
| `nuxt/third-party-after-hydration` | Initialise DOM-modifying third-party libraries (tag managers, widgets) after hydration, ideally through `@nuxt/scripts`. | They mutate the DOM before Vue hydrates. | Hydration, "Third-party Libraries with Side Effects"; Performance, "Scripts" | Nuxt | static: `<script src>` in `app.vue`/`useHead` script with immediate init | – | `@nuxt/scripts@1.3.12`, MIT (registry; size not checked) | warning |
| `nuxt/ios-format-detection` | Disable iOS Safari format detection (`format-detection` meta) if phone numbers/dates render as text. | Safari wraps them in links before hydration (iOS-only mismatch). | Hydration, "Phone Numbers on iOS Safari" | Nuxt | static: no `format-detection` meta in nuxt.config `app.head` | – | – | info |
| `nuxt/route-rules-per-route` | Choose rendering per route with `routeRules` (`prerender`, `swr`, `isr`, `ssr: false`) instead of one global mode. | Static where possible, fresh where needed. | Rendering Modes, "Hybrid Rendering"; Performance, "Hybrid Rendering" | Nuxt | manual | – | – | info |
| `nuxt/spa-loading-template` | With `ssr: false`, provide `app/spa-loading-template.html`. | Otherwise users see a blank page until JS boots. | Rendering Modes, "Client-Side Rendering" | Nuxt SPA | static: `ssr: false` and no template file | – | – | warning |
| `nuxt/server-components-experimental` | Treat `.server.vue` components / islands as experimental and avoid them for critical paths. | Docs mark server components experimental with open issues. | Server Components | Nuxt | static: `*.server.vue` present (info) | – | – | info |
| `nuxt/no-runtime-in-page-meta` | Keep `definePageMeta` free of runtime values (it is extracted at build time). | Values are not available when the meta chunk runs. | `@nuxt/eslint-plugin` `no-page-meta-runtime-values` | Nuxt | static: lint rule | – | – | error |

## Accessibility

Nuxt's guide says most a11y is ordinary Vue/HTML work; Nuxt's part is client-side navigation. `@nuxt/a11y` (axe-core in DevTools, optional report on `nuxt generate`) is **alpha** (1.0.0-alpha.1). Automated checks find only part of the problems.

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `nuxt/route-announcer` | Render `<NuxtRouteAnnouncer />` in `app.vue` (or a layout) so client navigations are announced. | Screen readers otherwise don't notice SPA navigations. | Accessibility, "Route Announcements"; `<NuxtRouteAnnouncer>` (Nuxt 3.12+) | Nuxt ≥3.12 | static: no `NuxtRouteAnnouncer` in `app.vue`/`layouts/` | – | – | warning |
| `nuxt/unique-titles` | Give every route a distinct title (`useHead`/`useSeoMeta`, with a `titleTemplate` in `app.vue`). | The announcer reads the title; equal titles announce nothing. | Accessibility, "Page Titles" | Nuxt | static: pages without `useHead({ title })`/`useSeoMeta`; runtime: duplicate titles | – | – | warning |
| `nuxt/announce-dynamic-updates` | Announce in-page changes (search results, validation, toasts) with `useRouteAnnouncer().set` or `<NuxtAnnouncer>`/`useAnnouncer`. | Silent updates are missed by screen-reader users. | Accessibility, "Route Announcements" | Nuxt ≥4.4 (announcer added in 4.4 per blog) | manual | – | – | info |
| `nuxt/nuxtlink-not-click-div` | Navigate with `<NuxtLink>`, not a `<div @click="navigateTo()">`. | A real `<a href>` is focusable and supports new-tab/middle-click. | Accessibility, "Links"; Performance, "Links" | Nuxt | static: `@click` calling `navigateTo`/`router.push` on non-interactive elements | `<div @click="navigateTo('/x')">` → `<NuxtLink to="/x">` | – | error |
| `nuxt/aria-current-query-links` | For links that differ only by query (filters), set your own `aria-current` so only one item is current. | Vue Router ignores the query, marking all as current. | Accessibility, "Links" | Nuxt | manual | – | – | info |
| `nuxt/external-for-public-files` | Mark links to `public/` files or same-origin non-Nuxt apps as `external`. | Router can't match them. | Accessibility, "Links" | Nuxt | static: `<NuxtLink to="/file.pdf">` without `external` | – | – | warning |
| `nuxt/skip-link-and-focus` | Add a skip link to `#main` as the first tab stop; optionally move focus to `<main tabindex="-1">` on path changes (client plugin). | Focus stays on the old link after navigation. | Accessibility, "Focus Management" | Nuxt | static: no skip link in `app.vue`; manual keyboard test | – | – | warning |
| `nuxt/reduced-motion-scroll` | If you customise scroll behaviour with smooth scrolling, respect `prefers-reduced-motion`. | Motion sensitivity. | Accessibility, "Scroll Behavior" | Nuxt | static: `behavior: 'smooth'` in `router.options` without media check | – | – | info |

## Performance

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `nuxt/lazy-components` | Prefix rarely-needed components with `Lazy` (e.g. behind `v-if`) to split their code. | Smaller initial JS. | Performance, "Lazy Loading Components"; Components, "Dynamic Imports" | Nuxt | manual | `<HeavyChart v-if>` → `<LazyHeavyChart v-if>` | – | info |
| `nuxt/lazy-hydration-below-fold` | Use `hydrate-on-visible`/`-idle`/`-interaction` on `Lazy*` components below the fold; never on above-the-fold content, and never `hydrate-never` on interactive components. | Less hydration work, without breaking interactivity. | Components, "Delayed (or Lazy) Hydration" → "Caveats and Best Practices" | Nuxt | static: `hydrate-never` on component containing `@click`/`v-model`; `hydrate-*` without `Lazy` prefix | – | – | warning |
| `nuxt/use-nuxt-img` | Use `<NuxtImg>` (`@nuxt/image`) for content images, with `:preload="{ fetchPriority: 'high' }"` only for the LCP image and lazy loading for the rest. | Modern formats, resizing, `sizes`. | Performance, "Images" | Nuxt | static: raw `<img>` in components when `@nuxt/image` installed | – | `@nuxt/image@2.2.1`, MIT (registry) | warning |
| `nuxt/use-nuxt-fonts` | Load web fonts via `@nuxt/fonts` (self-hosted, metric-adjusted fallbacks) instead of third-party `<link>` stylesheets. | Fewer requests, less CLS, privacy. | Performance, "Fonts" | Nuxt | static: `fonts.googleapis.com` link in `app.head` | – | `@nuxt/fonts@1.2.0`, MIT (registry) | info |
| `nuxt/few-light-plugins` | Keep plugins few and cheap; prefer composables/utils; mark async plugins `parallel: true`. | Plugins run during hydration and block rendering. | Plugins best practices; Performance, "Overusing plugins" | Nuxt | static: count of files in `plugins/`; async `defineNuxtPlugin` without `parallel` | – | – | warning |
| `nuxt/remove-unused-deps` | Remove unused dependencies and code. | Bundle size. | Performance, "Unused code / dependencies" | Nuxt | static: knip-style unused dep check (tool choice open) | – | – | info |
| `nuxt/analyze-bundle` | Inspect bundles with `nuxi analyze` and Nuxt DevTools before optimising. | Measure first. | Performance, "Profiling Tools" | Nuxt | manual | – | – | info |

## Security and configuration

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `nuxt/runtime-config-public-only-public` | Put only browser-safe values under `runtimeConfig.public`; secrets go in top-level `runtimeConfig` keys (server-only). | `public` keys are added to every page payload. | Runtime Config, "Exposing" | Nuxt | static: `public:` keys named like secret/token/key/password | `public: { apiSecret }` → `apiSecret` at top level | – | error |
| `nuxt/use-runtime-config-not-process-env` | Read configuration through `useRuntimeConfig()`, not `process.env` in app code. | `.env` is not read in production; runtime config can be overridden with `NUXT_*` vars. | `.env` docs (important note); Runtime Config | Nuxt | static: `process.env.` in `app/` files; lint `nuxt/prefer-import-meta` for `process.client`/`process.server` | `process.env.API_URL` → `useRuntimeConfig().public.apiBase` | – | warning |
| `nuxt/env-names-match-config` | Override runtime config only with matching `NUXT_` / `NUXT_PUBLIC_` env names; don't default a key to a differently named `process.env.X`. | Mismatched names work only at build time and break at runtime. | Runtime Config, "Environment Variables" (warning) | Nuxt | static: `runtimeConfig` value `process.env.<NAME>` where NAME ≠ derived `NUXT_` name | `apiBase: process.env.API_URL` → env `NUXT_PUBLIC_API_BASE` | – | warning |
| `nuxt/env-not-committed` | Keep `.env` in `.gitignore` and set real env vars in production hosting. | Secrets in repo; `.env` is not used in production. | `.env` docs | Nuxt | static: `.env` tracked or missing from `.gitignore` | – | – | error |
| `nuxt/app-secret-set` | When a module or `useSession` needs it, set `NUXT_APP_SECRET` (≥32 random bytes) in every deployed environment. | Builds never generate one; dev's generated secret is not for production. | Runtime Config, "Application Secret"; blog 4.6 | Nuxt ≥4.6 | runtime/deploy config check | – | – | error |
| `nuxt/vue-security-applies` | Apply Vue's `v-html`, URL, style and template-injection rules to Nuxt templates and server-rendered content. | Same XSS surface; SSR makes untrusted templates a server risk. | Vue Security guide (see `vue.md`) | Nuxt | static: `vue/no-v-html` via @nuxt/eslint | – | – | error |
| `nuxt/stay-patched` | Upgrade from Nuxt 3 (EOL 2026-07-31) and stay on the latest 4.x patch; watch Nuxt security patch posts. | Security fixes land in patch releases. | blog 4.6; "Nuxt Security Patch Releases" (2026-07-27) | Nuxt | static: installed version vs registry | – | – | error |

## Notes for skill authors

- Short skill: `useFetch`/`useAsyncData` vs `$fetch`, explicit keys, no module-scope state, hydration causes, `runtimeConfig.public` exposure, `<NuxtRouteAnnouncer>` + unique titles + `<NuxtLink>`. Static check: `@nuxt/eslint` (it already includes `eslint-plugin-vue`). Reference `vue.md` for everything Vue-level instead of repeating it.
- Reference file: lazy hydration strategies and caveats, routeRules modes, payload options (`pick`, `serialize: false`), focus-management plugin snippet idea, AI resources.
- Noisy: `no-bare-fetch-in-setup` must skip `$fetch` inside functions/handlers; `few-light-plugins` is a count heuristic (info/warning only). `pick-payload` is advisory.
- Changes often: Nuxt ships a minor every ~2–3 months (4.4 March, 4.5 July, 4.6 October 2026) and `compatibilityVersion: 5` previews Nuxt 5 defaults (typed `$fetch`, typed pages). `@nuxt/a11y` is alpha; Vapor needs Vue 3.6 (RC). Recheck the blog and npm each run.
- Manual only: whether announcements and titles are meaningful, keyboard focus after navigation (the docs suggest testing by keyboard), whether a value in `runtimeConfig.public` is really safe.

## AI-agent resources (official)

- `https://nuxt.com/llms.txt` (index) and `https://nuxt.com/llms-full.txt` (whole docs; HTTP 200); any docs/blog page as Markdown by appending `.md` or sending `Accept: text/markdown`; `https://nuxt.com/sitemap.md` — https://nuxt.com/docs/4.x/guide/ai/llms-txt
- Remote MCP server (streamable HTTP) at `https://nuxt.com/mcp`, server card `https://nuxt.com/.well-known/mcp/server-card.json`; tools for docs, blog, deployment, modules, changelog; Claude Code: `claude mcp add --transport http nuxt https://nuxt.com/mcp` — https://nuxt.com/docs/4.x/guide/ai/mcp
- Public read-only REST API under `https://nuxt.com/api/v1` (modules, health), described by `https://nuxt.com/openapi.json` (stated in llms.txt).
- On-site agents: "Introducing the Nuxt Agent" (2026-04-29), "Meet Nuxi" (2026-06-09) on the blog — not tools for a local project.

## Not verified

- ESLint rule id prefix for `@nuxt/eslint-plugin` (`nuxt/…`): rule names read from the tarball; the registered plugin namespace was not confirmed in its README.
- Full rule set `@nuxt/eslint-config` enables by default (which `eslint-plugin-vue` preset): the module page does not list it; only package dependencies were read.
- Nuxt 3-era root-level layout (`pages/` at root without `app/`) still being auto-detected in Nuxt 4: not confirmed on a v4 docs page this pass; detection should accept both.
- `@nuxt/hints` behaviour and status: only the npm description was read.
- Year/version when `<NuxtAnnouncer>`/`useAnnouncer` arrived: the blog list says Nuxt 4.4 added "a new accessibility announcer"; the component page was not opened.
- Sizes (min+gzip) for `@nuxt/image`, `@nuxt/fonts`, `@nuxt/scripts`: not fetched; they are build-time modules, so client cost differs from package size.
- Community security module (`nuxt-security`): not official, not reviewed.
