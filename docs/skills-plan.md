# Skills plan

The skills to write, by lane. Each lane is one content agent; a lane owns its skills and the rules those skills own. Versions are the latest stable releases on the npm registry, checked on **2026-11-11** (`https://registry.npmjs.org/<package>/latest`); recheck before writing and put the date in the skill's reference file.

Status: ✅ written (reference examples), ⬜ to write. Every skill follows `docs/authoring.md`.

## Lane A: HTML, CSS, responsive, forms, images, fonts, motion

| Skill | Area | requires | One line |
| --- | --- | --- | --- |
| ✅ `fe-html` | foundations | web | Documents, head, landmarks, headings, semantic elements, images and buttons. |
| ⬜ `fe-css-architecture` | styling | web | Cascade layers, custom properties as tokens, specificity, naming, file organisation, what to avoid. |
| ⬜ `fe-css-layout` | styling | web | Flexbox, grid, container queries, logical properties, spacing systems, no fixed heights. |
| ⬜ `fe-css-modern` | styling | web | Baseline features worth using today (`:has()`, nesting, `@scope`, `color-mix()`, `@starting-style`), with their Baseline status. |
| ⬜ `fe-responsive` | foundations | web | Viewport, fluid type and space, breakpoints vs container queries, reflow at 320 CSS px, touch targets, print. Owns `responsive/*` and `a11y/zoom-not-blocked`. |
| ⬜ `fe-forms` | foundations | web | Native inputs and types, constraint validation, submission, file inputs; accessibility is in `fe-a11y-forms`. |
| ⬜ `fe-images` | performance | web | Formats (AVIF, WebP), `srcset`/`sizes`, `<picture>`, lazy loading, the LCP image, SVG. Owns `perf/img-dimensions`, `perf/large-image`. |
| ⬜ `fe-fonts` | performance | web | Self-hosting, `font-display`, preload, subsetting, variable fonts, fallback metrics. Owns `perf/font-display`. |
| ⬜ `fe-motion` | styling | web | Animating compositor properties, `prefers-reduced-motion`, View Transitions, scroll-driven animations. |

## Lane B: JavaScript, TypeScript, frameworks, styling tools, state and data

| Skill | Area | requires | Version (2026-11-11) | One line |
| --- | --- | --- | --- | --- |
| ⬜ `fe-javascript` | foundations | web | ES2025 | Modules, DOM and events, async and errors, W3Schools JS conventions, no globals. |
| ⬜ `fe-typescript` | foundations | typescript | 7.0 | Strict config, types at the boundaries (API, forms, storage), narrowing, no `any`. |
| ✅ `fe-react` | frameworks | react | 19.3 | Components, keys, state, effects, React 19 APIs, compiler. |
| ⬜ `fe-nextjs` | frameworks | next | 16.4 | App Router, Server and Client Components, caching and data, metadata, `next/image`, `next/font`. |
| ⬜ `fe-vue` | frameworks | vue | 3.5 | `<script setup>`, Composition API, reactivity pitfalls, `v-for` keys, `useId`. |
| ⬜ `fe-nuxt` | frameworks | nuxt | 4.6 | Directory structure, data fetching (`useFetch`, `useAsyncData`), `useHead`/`useSeoMeta`, rendering modes. |
| ⬜ `fe-angular` | frameworks | angular | 22.2 | Standalone components, signals, built-in control flow, zoneless, `NgOptimizedImage`, CDK a11y. |
| ⬜ `fe-svelte` | frameworks | svelte | 5.57 | Runes (`$state`, `$derived`, `$effect`, `$props`), snippets, events, a11y warnings. |
| ⬜ `fe-sveltekit` | frameworks | sveltekit | 3.2 | Routing, `load`, form actions with progressive enhancement, `app.html`, rendering options. |
| ⬜ `fe-astro` | frameworks | astro | 7.4 | Islands and `client:*` directives, content collections, `astro:assets`, layouts. |
| ⬜ `fe-web-components` | frameworks | lit webc | Lit 3.3 | Custom elements, shadow DOM and forms (`ElementInternals`), slots, accessibility across the shadow boundary. |
| ⬜ `fe-tailwind` | styling | tailwind | 4.3 | CSS-first config (`@theme`), utilities vs components, `focus-visible:`, `dvh`, no arbitrary-value sprawl. |
| ⬜ `fe-sass` | styling | sass | 1.108 | `@use`/`@forward` (no `@import`), modules, when plain CSS now suffices. |
| ⬜ `fe-state` | frameworks | react vue svelte angular | Pinia 4.1 | Where state lives, stores (Pinia, Zustand, Redux Toolkit, signals), URL state, no duplicated server state. |
| ⬜ `fe-data-fetching` | frameworks | react vue svelte angular next nuxt | TanStack Query 5.107 | Server-state libraries vs framework loaders, caching, loading and error UI, race conditions. |

## Lane C: accessibility, performance, SEO, i18n, security, testing, tooling

| Skill | Area | requires | One line |
| --- | --- | --- | --- |
| ⬜ `fe-a11y-core` | accessibility | web | WCAG 2.2 A and AA mapped to front-end code: the index of criteria, what is automated, what needs a person; points to the skills below. |
| ✅ `fe-a11y-forms` | accessibility | web | Labels, autocomplete, errors, groups, authentication (1.3.1, 1.3.5, 3.3.1–3.3.8, 4.1.2). |
| ✅ `fe-a11y-keyboard` | accessibility | web | Keyboard access, focus order and visibility, focus not obscured, focus management, skip links (2.1.1, 2.1.2, 2.4.1, 2.4.3, 2.4.7, 2.4.11). Owns `a11y/positive-tabindex`, `a11y/no-click-on-static`, `a11y/focus-visible`. |
| ✅ `fe-a11y-visual` | accessibility | web | Contrast, use of colour, text spacing, reflow, resize, target size, non-text contrast (1.4.1, 1.4.3, 1.4.4, 1.4.10–1.4.13, 2.5.8). |
| ✅ `fe-a11y-aria` | accessibility | web | Accessible names, roles and states, live regions, the first rule of ARIA (4.1.2, 4.1.3). |
| ✅ `fe-a11y-media` | accessibility | web | Captions, transcripts, audio description, autoplay, flashing, pause controls (1.2.x, 1.4.2, 2.2.2, 2.3.1). |
| ⬜ `fe-a11y-dialog` | accessibility | web | Modal and non-modal dialogs with `<dialog>`, focus in and out, inert background (APG Dialog). |
| ⬜ `fe-a11y-menus` | accessibility | web | Disclosure, navigation menus, menu buttons; when not to use `role="menu"` (APG Disclosure, Menu Button). |
| ⬜ `fe-a11y-tabs-accordion` | accessibility | web | Tabs and accordions with the right keyboard model (APG Tabs, Accordion). |
| ⬜ `fe-a11y-combobox` | accessibility | web | Autocomplete, select-only combobox, listbox (APG Combobox, Listbox). |
| ⬜ `fe-a11y-carousel-toast` | accessibility | web | Carousels with pause and controls; toasts and status messages that are announced and not timed out (APG Carousel). |
| ⬜ `fe-a11y-tables` | accessibility | web | Data tables, headers and captions, sortable columns, responsive tables. |
| ⬜ `fe-core-web-vitals` | performance | web | LCP (≤ 2.5 s), INP (≤ 200 ms), CLS (≤ 0.1) at the 75th percentile: causes and fixes per framework. |
| ⬜ `fe-lighthouse` | performance | web | Running Lighthouse 13 locally and in CI, reading the score (weights: TBT 30, LCP 25, CLS 25, FCP 10, SI 10), budgets. |
| ⬜ `fe-perf-delivery` | performance | web | JavaScript and CSS delivery, code splitting, hydration cost, third-party scripts, caching and resource hints; cites `perf/render-blocking-script` (owned by `fe-html`). |
| ⬜ `fe-seo-metadata` | quality | web | Titles, descriptions, canonical, Open Graph, structured data, sitemap and robots, per framework. |
| ⬜ `fe-i18n` | quality | web | `lang` and `dir`, `Intl` formatting, message formats, RTL with logical properties, framework i18n libraries. |
| ⬜ `fe-security` | quality | web | XSS sinks (`innerHTML`, `dangerouslySetInnerHTML`, `v-html`, `{@html}`), CSP, Trusted Types, SRI, third-party code. |
| ⬜ `fe-testing` | quality | vitest jest playwright cypress testing-library | Unit, component (Testing Library queries by role), end-to-end (Playwright 1.65), accessibility in tests (axe-core). |
| ⬜ `fe-tooling` | quality | vite eslint prettier biome | Vite 8, ESLint 10 flat config with a11y plugins, Prettier 3 or Biome 2, browserslist and Baseline. |

## Workflow skills (lane C after its first three skills, or a fourth agent)

| Skill | One line |
| --- | --- |
| ⬜ `fe-learn` | Run `init`/`learn`, read the profile, confirm conventions with the person, record lessons. |
| ⬜ `fe-audit` | Run `audit` (and `--url` when a page is running), read the JSON, explain the top findings, propose an order of fixes. |
| ⬜ `fe-fix` | Fix findings by rule id, smallest change first, re-run `audit --changed`, never suppress without a reason. |
| ⬜ `fe-review` | Review a diff of front-end code: run `audit --changed`, then the manual rules of the touched skills; report by rule id. |
| ⬜ `fe-component` | Build a new component: semantics first, keyboard model from the APG, states, responsive, tests, then audit. |

## Stack keys

What `requires` and a rule's `stack` may name. `cli/lib/detect.mjs` produces exactly these.

`web` (every front-end project), `html` (a plain site without a framework), `react`, `next`, `preact`, `vue`, `nuxt`, `angular`, `svelte`, `sveltekit`, `astro`, `solid`, `lit`, `webc` (custom elements without Lit), `tailwind`, `sass`, `less`, `css-modules`, `typescript`, `vite`, `webpack`, `vitest`, `jest`, `playwright`, `cypress`, `testing-library`, `storybook`, `eslint`, `prettier`, `biome`, `tanstack-query`, `swr`, `redux`, `zustand`, `pinia`, `jotai`, `i18n`.

## Rule areas by lane

Lane A: `html`, `css`, `responsive`, plus `perf` rules about images and fonts. Lane B: `js`, `ts`, `react`, `next`, `vue`, `nuxt`, `angular`, `svelte`, `astro`, `webc`, `tailwind`, `sass`, `state`. Lane C: `a11y`, `perf` (delivery, vitals), `seo`, `i18n`, `security`, `test`, `tooling`. An id that another lane owns is cited, not redefined.
