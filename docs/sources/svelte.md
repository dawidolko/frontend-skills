# Svelte 5 and SvelteKit: sources and candidate rules

Read on 2026-11-11. Primary sources:

- npm registry: `svelte` (https://www.npmjs.com/package/svelte), `@sveltejs/kit` (https://www.npmjs.com/package/@sveltejs/kit), `svelte-check`, `eslint-plugin-svelte` (data from https://registry.npmjs.org/<name>)
- Svelte blog (https://svelte.dev/blog): "SvelteKit 3 is here", Oct 1 2026
- Svelte docs, read through the official full text https://svelte.dev/llms-full.txt (same source as the site). Section URLs used below: https://svelte.dev/docs/svelte/best-practices, https://svelte.dev/docs/svelte/$effect, https://svelte.dev/docs/svelte/@html, https://svelte.dev/docs/svelte/await-expressions, https://svelte.dev/docs/svelte/compiler-warnings, https://svelte.dev/docs/svelte/runtime-warnings, https://svelte.dev/docs/svelte/custom-elements, https://svelte.dev/docs/svelte/getting-started
- SvelteKit docs: https://svelte.dev/docs/kit/project-structure, https://svelte.dev/docs/kit/load, https://svelte.dev/docs/kit/page-options, https://svelte.dev/docs/kit/state-management, https://svelte.dev/docs/kit/remote-functions, https://svelte.dev/docs/kit/server-only-modules, https://svelte.dev/docs/kit/accessibility, https://svelte.dev/docs/kit/performance, https://svelte.dev/docs/kit/seo, https://svelte.dev/docs/kit/migrating-to-sveltekit-3, https://svelte.dev/docs/kit/@sveltejs-kit-vite (config incl. `csp`)
- Svelte CLI `sv check`: https://svelte.dev/docs/cli/sv-check
- AI docs: https://svelte.dev/docs/ai/overview, https://svelte.dev/docs/mcp/overview, https://svelte.dev/llms.txt
- eslint-plugin-svelte rule list: https://github.com/sveltejs/eslint-plugin-svelte/blob/main/docs/rules.md

## Version and status (verified 2026-11-11)

| package | latest | published | licence (registry) | note |
|---|---|---|---|---|
| `svelte` | 5.57.3 | 2026-10-26 | MIT | 5.0.0 published 2024-10-19; no Svelte 6 on npm (`next` tag is an old 5.0 prerelease) |
| `@sveltejs/kit` | 3.2.0 | 2026-11-10 | MIT | 3.0.0 published 2026-10-01 (blog "SvelteKit 3 is here", Oct 1 2026); 2.x still tagged `version-2` = 2.70.4 |
| `svelte-check` | 4.7.8 | 2026-11-01 | MIT | run via `npx sv check` |
| `eslint-plugin-svelte` | 3.24.1 | 2026-11-07 | MIT | |

SvelteKit 3 minimums (https://svelte.dev/docs/kit/migrating-to-sveltekit-3): Node 22.17, TypeScript 6, Svelte 5.57.1, Vite 8.0.12, `@sveltejs/vite-plugin-svelte` 7. Migration: `npx sv migrate sveltekit-3`.

## Detection (for stack detection)

| signal | meaning | source |
|---|---|---|
| `svelte` in `package.json` (dev)deps; `*.svelte`, `*.svelte.js`, `*.svelte.ts` files | Svelte | https://svelte.dev/docs/svelte/svelte-files |
| `@sveltejs/kit` in devDependencies (with `svelte` and `vite`) | SvelteKit | https://svelte.dev/docs/kit/project-structure |
| Major of `@sveltejs/kit`: **3.x** → config is in `vite.config.(js|ts)` inside `sveltekit({...})` from `@sveltejs/kit/vite`; `svelte.config.js` is no longer supported. **2.x** → config in `svelte.config.js` (`kit: {...}`) | version gate | https://svelte.dev/docs/kit/migrating-to-sveltekit-3 ("svelte.config.js is no longer supported") |
| `src/routes/**/+page.svelte`, `+layout.svelte`, `+page(.server).ts`, `+server.ts`, `src/app.html`, `src/hooks.server.ts`, `.svelte-kit/` | SvelteKit | https://svelte.dev/docs/kit/project-structure |
| Kit 3: `#lib` subpath import in `package.json` `imports`; Kit 2: `$lib` alias | version gate | migration guide ("$lib is now #lib") |
| `@sveltejs/vite-plugin-svelte` in deps without kit; `svelte.config.js` may hold `compilerOptions` | plain Svelte + Vite SPA | https://svelte.dev/docs/svelte/getting-started |
| Runes mode: `$state(`, `$derived(`, `$props(` in `.svelte`; legacy mode: `export let`, `$:` | Svelte 5 runes vs legacy syntax | https://svelte.dev/docs/svelte/best-practices ("Avoid legacy features") |
| `<svelte:options customElement=` | Svelte compiled to web components | https://svelte.dev/docs/svelte/custom-elements |
| `*.remote.ts` files | SvelteKit remote functions (experimental) | https://svelte.dev/docs/kit/remote-functions |

## Components and runes

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| svelte/runes-for-new-code | Write new components in runes mode and avoid legacy syntax (`export let`, `$:`, `on:click`, `<slot>`, `<svelte:component>`, `<svelte:self>`, `use:` actions, `class:`), using `$props`, `$derived`, `onclick`, snippets, `{@attach}` and clsx-style `class`. | Legacy features have modern replacements; compiler emits deprecation warnings. | https://svelte.dev/docs/svelte/best-practices ("Avoid legacy features"); warnings `event_directive_deprecated`, `slot_element_deprecated`, `svelte_component_deprecated` (https://svelte.dev/docs/svelte/compiler-warnings) | Svelte 5 | static: grep legacy syntax in `.svelte` | `export let x` → `let { x } = $props()` | – | warning |
| svelte/state-only-when-reactive | Use `$state` only for values that must drive updates; keep the rest as plain variables, and prefer `$state.raw` for large objects that are only reassigned. | Deep state is proxied, which costs performance. | https://svelte.dev/docs/svelte/best-practices (`$state`) | Svelte 5 | static (lint `svelte/no-unnecessary-state-wrap`) | – | – | info |
| svelte/derived-not-effect | Compute values from state with `$derived`/`$derived.by`, not by assigning inside `$effect`. | Effects are an escape hatch; assigning state in effects leads to loops and convoluted code. | https://svelte.dev/docs/svelte/best-practices (`$derived`, `$effect`); https://svelte.dev/docs/svelte/$effect ("When not to use $effect"); lint `svelte/prefer-writable-derived` | Svelte 5 | static: `$effect(` body that only assigns a `$state` variable | `$effect(() => { sq = n*n })` → `let sq = $derived(n*n)` | – | warning |
| svelte/effect-no-read-write-loop | Never read and write the same state inside one `$effect`. | Triggers `effect_update_depth_exceeded` (infinite loop). | https://svelte.dev/docs/svelte/runtime-warnings / runtime errors (`effect_update_depth_exceeded`) | Svelte 5 | static heuristic; runtime: error in console | – | – | error |
| svelte/effect-alternatives | Use event handlers or function bindings for user-driven logic, `{@attach}` for syncing with DOM libraries, `$inspect` for debugging, `createSubscriber` for external sources, and `<svelte:window>`/`<svelte:document>` for global listeners instead of `$effect`/`onMount`. | Each has a better-fitting primitive. | https://svelte.dev/docs/svelte/best-practices (`$effect`, Events) | Svelte 5 | static: `$effect`/`onMount` calling `addEventListener` on window/document (lint `svelte/no-add-event-listener`) | `onMount(() => window.addEventListener('keydown', f))` → `<svelte:window onkeydown={f} />` | – | warning |
| svelte/no-browser-guard-in-effect | Do not wrap effect bodies in `if (browser)`. | Effects never run on the server. | https://svelte.dev/docs/svelte/best-practices (`$effect`) | Svelte 5 | static: `$effect(() => { if (browser)` | remove the guard | – | info |
| svelte/props-are-live | Treat props as changing values: derive from them with `$derived` instead of copying into a plain `let`. | A plain copy captures only the first value (`state_referenced_locally` warning). | https://svelte.dev/docs/svelte/best-practices (`$props`); https://svelte.dev/docs/svelte/compiler-warnings (`state_referenced_locally`) | Svelte 5 | static: compiler warning | `let c = type === 'a' ? 1 : 2` → `let c = $derived(...)` | – | warning |
| svelte/non-reactive-update | Declare with `$state` any variable that is reassigned and read in the template. | Otherwise updates are not shown (`non_reactive_update`). | https://svelte.dev/docs/svelte/compiler-warnings (`non_reactive_update`) | Svelte 5 | static: compiler warning | `let open = false` → `let open = $state(false)` | – | error |
| svelte/keyed-each | Key every `{#each}` that can change with a unique id, never the index. | Lets Svelte insert/remove precisely. | https://svelte.dev/docs/svelte/best-practices (Each blocks); lint `svelte/require-each-key`, `svelte/valid-each-key` | Svelte | static: `{#each x as y}` without `(key)` | `{#each items as item}` → `{#each items as item (item.id)}` | – | warning |
| svelte/key-block-sparingly | Use `{#key}` only when you need remount-driven transitions; derive values instead. | It destroys and recreates everything inside. | https://svelte.dev/docs/svelte/best-practices (`#key` block) | Svelte | static: count `{#key` | – | – | info |
| svelte/style-child-via-custom-props | Let parents style children through CSS custom properties (`<Child --color="red" />`) and keep `:global` for third-party children only. | Preserves scoping. | https://svelte.dev/docs/svelte/best-practices (Styling child components) | Svelte | static: count `:global(` | – | – | info |
| svelte/context-over-module-state | Share state through context (`createContext`) rather than module-level variables. | Module state can leak between users during SSR. | https://svelte.dev/docs/svelte/best-practices (Context); https://svelte.dev/docs/kit/state-management | Svelte + SSR | static: exported `$state` in `.svelte.ts` used by SSR routes (heuristic) | – | – | warning |
| svelte/async-experimental | Use `await` in components/`$derived` only with `compilerOptions.experimental.async` enabled, and avoid waterfalls between independent async deriveds. | Still experimental until Svelte 6; `await_waterfall` warning. | https://svelte.dev/docs/svelte/await-expressions; https://svelte.dev/docs/svelte/runtime-warnings (`await_waterfall`) | Svelte ≥5.36 | static: config flag; runtime warning | – | – | info |

## Data and state in SvelteKit

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| svelte/kit-no-shared-server-state | Never keep per-user data in module-level variables on the server; authenticate with cookies and persist in a database. | A long-lived server shares those variables between all users. | https://svelte.dev/docs/kit/state-management ("Avoid shared state on the server") | SvelteKit | static: top-level `let` mutated in `+page.server.ts`/`hooks.server.ts` | – | – | error |
| svelte/kit-pure-load | Keep `load` functions free of side effects; return data instead of writing to stores/global state. | Same leak risk; easier to reason about. | https://svelte.dev/docs/kit/state-management ("No side-effects in load") | SvelteKit | static: assignments to imported stores inside `load` | – | – | warning |
| svelte/kit-avoid-waterfalls | Start independent requests before `await parent()`, fetch dependent backend data in server `load`, and stream non-essential data as un-awaited promises. | Sequential requests are a top performance killer. | https://svelte.dev/docs/kit/load ("Using parent data", "Streaming with promises"); https://svelte.dev/docs/kit/performance ("Preventing waterfalls") | SvelteKit | static: `await parent()` as first statement before unrelated fetch | – | – | warning |
| svelte/kit-url-state | Keep shareable UI state like filters/sort in URL search params; use snapshots for disposable state. | Survives reload and works with SSR. | https://svelte.dev/docs/kit/state-management ("Storing state in the URL") | SvelteKit | manual | – | – | info |
| svelte/kit-private-env | Read secrets only from `$app/env/private` (Kit 3; `$env/*/private` in Kit 2, deprecated in 3) or modules under a `server` directory / `.server.ts`. | Kit refuses to bundle them into client code. | https://svelte.dev/docs/kit/server-only-modules; https://svelte.dev/docs/kit/migrating-to-sveltekit-3 (`$env/...` deprecated) | SvelteKit | static: `import.meta.env.SECRET`/private module imported from `+page.svelte` | – | – | error |
| svelte/kit3-app-state | Use `$app/state` (`page`, `navigating`, `updated`) instead of `$app/stores`, which is removed in Kit 3. | Removed module breaks build. | https://svelte.dev/docs/kit/migrating-to-sveltekit-3 (`$app/stores` removed) | SvelteKit 3 | static: `from '$app/stores'` | `$page.url` → `page.url` | – | error (Kit 3) / info (Kit 2) |
| svelte/kit-resolve-links | Build internal links and `goto()` targets with `resolve()` (and assets with `asset()`) from `$app/paths`. | Kit 3 removed `base`/`assets`; resolve keeps base path and typed routes correct. | https://svelte.dev/docs/kit/migrating-to-sveltekit-3 (`$app/paths`); lint `svelte/no-navigation-without-resolve` | SvelteKit | static: lint rule | `href="/about"` → `href={resolve('/about')}` | – | warning |
| svelte/kit-remote-functions-experimental | Treat remote functions (`query`/`form`/`command`/`prerender` in `*.remote.ts`) as experimental opt-in and validate their arguments. | Experimental flag required; they are server endpoints reachable from the client. | https://svelte.dev/docs/kit/remote-functions | SvelteKit ≥2.27 | static: `experimental.remoteFunctions` flag | – | – | info |

## Rendering modes (SSR, prerender, CSR)

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| svelte/kit-prerender-only-same-for-all | Set `prerender = true` only on pages where every visitor gets identical server output; no form actions and no `url.searchParams` during prerender. | Otherwise build fails or serves wrong content. | https://svelte.dev/docs/kit/page-options ("When not to prerender") | SvelteKit | static: `prerender = true` in a route that has `actions` or reads `url.searchParams` in `load` | – | – | error |
| svelte/kit-keep-ssr | Keep `ssr` on; set `ssr = false` only for routes that truly cannot render on the server, and never in the root layout of a site meant to be static. | SPA mode creates request waterfalls and hurts SEO. | https://svelte.dev/docs/kit/page-options (`ssr`); https://svelte.dev/docs/kit/performance (SPA waterfalls); https://svelte.dev/docs/kit/seo | SvelteKit | static: `export const ssr = false` in `src/routes/+layout.(js|ts)` | – | – | warning |
| svelte/kit-csr-false-static | Use `csr = false` for pages that need no JavaScript (e.g. articles). | Ships zero JS. | https://svelte.dev/docs/kit/page-options (`csr`) | SvelteKit | manual | – | – | info |
| svelte/kit-server-file-extensions | Give `+server.js` routes a file extension in the path (e.g. `foo.json/+server.js`) when they are prerendered. | Avoids file/dir conflicts in output. | https://svelte.dev/docs/kit/page-options ("Route conflicts") | SvelteKit | static | – | – | info |
| svelte/no-ssr-custom-elements | Do not rely on Svelte-built custom elements for SSR content. | Shadow DOM stays invisible until JS loads. | https://svelte.dev/docs/svelte/custom-elements ("Caveats and limitations") | Svelte `customElement` | static | – | – | info |

## Accessibility

Helps you work to WCAG 2.2 AA; the compiler warnings and lint find only part of the problems.

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| svelte/a11y-compiler-warnings | Treat Svelte's `a11y_*` compiler warnings as errors in CI and only silence one with `<!-- svelte-ignore code (reason) -->`. | They catch common markup faults at compile time. | https://svelte.dev/docs/svelte/compiler-warnings (codes include `a11y_missing_attribute`, `a11y_click_events_have_key_events`, `a11y_no_static_element_interactions`, `a11y_interactive_supports_focus`, `a11y_label_has_associated_control`, `a11y_media_has_caption`, `a11y_missing_content`, `a11y_no_noninteractive_tabindex`, `a11y_positive_tabindex`, `a11y_role_has_required_aria_props`, `a11y_unknown_aria_attribute`, `a11y_unknown_role`, `a11y_autofocus`, `a11y_distracting_elements`, `a11y_img_redundant_alt`, `a11y_consider_explicit_label`, `a11y_hidden`, `a11y_accesskey`, `a11y_autocomplete_valid`) | Svelte | static: `npx sv check` (svelte-check) or `svelte/valid-compile` | `<div onclick>` → `<button type="button" onclick>` | – | error |
| svelte/a11y-no-unused-ignores | Remove `svelte-ignore` comments that no longer suppress anything. | Stale ignores hide future issues. | lint `svelte/no-unused-svelte-ignore` | Svelte | static | – | – | info |
| svelte/kit-unique-title | Give every page a unique, descriptive `<title>` in `<svelte:head>`. | Kit's route announcer reads the title after client navigation; also SEO. | https://svelte.dev/docs/kit/accessibility ("Route announcements"); https://svelte.dev/docs/kit/seo | SvelteKit | static: `+page.svelte` without `<svelte:head><title>` (or layout-only title) | – | – | warning |
| svelte/kit-html-lang | Set `lang` on `<html>` in `src/app.html` (and per page via the `handle` hook for multilingual sites). | Default template is English. | https://svelte.dev/docs/kit/accessibility ("The lang attribute") | SvelteKit | static: `src/app.html` `lang="en"` on non-English content (manual) | – | – | warning |
| svelte/kit-focus-management | Keep Kit's default focus reset after navigation; customise via `afterNavigate`, and avoid `autofocus` except where intended. | Keyboard/screen-reader users need a predictable start point. | https://svelte.dev/docs/kit/accessibility ("Focus management") | SvelteKit | manual | – | – | info |

## Performance

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| svelte/kit-images | Use `@sveltejs/enhanced-img` (or an image CDN) for local images. | Image size is often the largest win. | https://svelte.dev/docs/kit/performance ("Images"); https://svelte.dev/docs/kit/images | SvelteKit | static: large `<img src>` from `static/` | – | `@sveltejs/enhanced-img` (version/size Not verified) | info |
| svelte/kit-preload-fonts | Preload critical fonts yourself (Kit does not) and subset them. | Fonts are a common waterfall. | https://svelte.dev/docs/kit/performance ("Fonts") | SvelteKit | runtime: Lighthouse | – | – | info |
| svelte/kit-dynamic-import | Load rarely needed components with dynamic `import()`. | Keeps them out of the page bundle. | https://svelte.dev/docs/kit/performance ("Selective loading") | SvelteKit | manual | – | – | info |
| svelte/kit-measure-in-preview | Measure performance on `vite preview`/production builds, not `dev`. | Dev mode behaves differently. | https://svelte.dev/docs/kit/performance ("Diagnosing issues") | SvelteKit | manual | – | – | info |

## Security

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| svelte/no-unsanitized-html | Use `{@html}` only with content you control or have sanitized; never with raw user input. | It inserts unescaped HTML (XSS). | https://svelte.dev/docs/svelte/@html; lint `svelte/no-at-html-tags` | Svelte | static: `{@html` | `{@html comment}` → `{comment}` or sanitize first | sanitizer choice: see security file (Not verified here) | error |
| svelte/kit-csrf-trusted-origins | Keep CSRF protection on; in Kit 3 allow specific external origins via `csrf.trustedOrigins` and set `paths.origin` behind proxies. | `checkOrigin` was removed; cross-origin posts without `Content-Type` are rejected. | https://svelte.dev/docs/kit/migrating-to-sveltekit-3 ("Security") | SvelteKit 3 | static: `csrf.checkOrigin` in config | – | – | warning |
| svelte/kit-csp | Configure `csp` in the `sveltekit()` plugin options so Kit adds nonces/hashes to its own inline scripts and styles. | Defense in depth against XSS. | https://svelte.dev/docs/kit/@sveltejs-kit-vite (`csp`) | SvelteKit | static: no `csp` key in config | – | – | info |
| svelte/target-blank-rel | Add `rel="noopener noreferrer"` to `target="_blank"` links to other sites. | Lint rule exists (browsers now default to noopener; keep as info). | lint `svelte/no-target-blank` | Svelte | static | – | – | info |

## Official tooling

- `svelte-check` 4.7.8 via `npx sv check`: reports unused CSS, a11y hints and JS/TS errors (https://svelte.dev/docs/cli/sv-check).
- `eslint-plugin-svelte` 3.24.1 (sveltejs org). Useful rules: `svelte/valid-compile`, `svelte/no-at-html-tags`, `svelte/require-each-key`, `svelte/valid-each-key`, `svelte/prefer-writable-derived`, `svelte/no-reactive-reassign`, `svelte/infinite-reactive-loop`, `svelte/no-dom-manipulating`, `svelte/no-top-level-browser-globals`, `svelte/prefer-svelte-reactivity`, `svelte/no-unnecessary-state-wrap`, `svelte/no-add-event-listener`, `svelte/no-inspect`, `svelte/no-unused-svelte-ignore`, `svelte/no-navigation-without-resolve`, `svelte/button-has-type`, `svelte/no-target-blank`, `svelte/no-unused-props` (https://github.com/sveltejs/eslint-plugin-svelte/blob/main/docs/rules.md).
- Svelte MCP `svelte-autofixer` tool statically analyses Svelte code (below).

## AI-agent resources (exist, verified 2026-11-11)

- llms.txt index https://svelte.dev/llms.txt with https://svelte.dev/llms-full.txt (complete, ~1.3 MB), https://svelte.dev/llms-medium.txt, https://svelte.dev/llms-small.txt, and per package `/docs/svelte/llms.txt`, `/docs/kit/llms.txt`, `/docs/cli/llms.txt`, `/docs/ai/llms.txt`.
- Official MCP server: remote `https://mcp.svelte.dev/mcp`, local `npx -y @sveltejs/mcp`; tools `list-sections`, `get-documentation`, `svelte-autofixer`, `playground-link` (https://svelte.dev/docs/mcp/overview).
- Official AGENTS.md/CLAUDE.md prompt and skills; `npx sv add ai-tools` sets them up (https://svelte.dev/docs/ai/overview).

## Notes for skill authors

- Version gate first: Kit 2 vs Kit 3 changes config location (`svelte.config.js` → `vite.config.js`), aliases (`$lib` → `#lib`), env modules and `$app/stores` removal. Kit 3 is six weeks old; many projects are still on Kit 2.
- Short skill: runes over legacy, `$derived` over `$effect`, keyed each, `{@html}`, no shared server state, unique titles, prerender rules. Reference file: full a11y warning list, lint names, migration specifics.
- Compiler a11y warnings are good but can be noisy on custom widgets; allow `svelte-ignore` with a reason.
- Async Svelte and remote functions are experimental; recheck at Svelte 6.

## Not verified

- `@sveltejs/enhanced-img` version and size; not read on npm.
- Whether plain Svelte + Vite (non-Kit) projects still read `svelte.config.js` with vite-plugin-svelte 7; core docs still show `svelte.config.js` for `compilerOptions`, but the plugin's own docs were not opened.
- Exact Kit 3 config option names beyond those quoted in the migration guide (`csrf.trustedOrigins`, `paths.origin`, `output.linkHeaderPreload`).
