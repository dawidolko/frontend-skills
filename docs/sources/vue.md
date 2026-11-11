# Vue: sources and candidate rules

Read on 2026-11-11. Primary sources:

- npm registry: https://www.npmjs.com/package/vue (JSON https://registry.npmjs.org/vue), https://www.npmjs.com/package/eslint-plugin-vue (rule files and configs read from the 10.12.1 tarball), https://www.npmjs.com/package/@vitejs/plugin-vue, https://www.npmjs.com/package/pinia
- Vue blog: https://blog.vuejs.org/ (latest post "Announcing Vue 3.5", September 1, 2024)
- Docs (vuejs.org, each page has a `.md` twin listed in https://vuejs.org/llms.txt): Style Guide Priority A https://vuejs.org/style-guide/rules-essential, Priority B https://vuejs.org/style-guide/rules-strongly-recommended, Priority D https://vuejs.org/style-guide/rules-use-with-caution, Reactivity Fundamentals https://vuejs.org/guide/essentials/reactivity-fundamentals, Computed https://vuejs.org/guide/essentials/computed, Watchers https://vuejs.org/guide/essentials/watchers, List Rendering https://vuejs.org/guide/essentials/list, Props https://vuejs.org/guide/components/props, Composables https://vuejs.org/guide/reusability/composables, Async Components https://vuejs.org/guide/components/async, State Management https://vuejs.org/guide/scaling-up/state-management, SSR https://vuejs.org/guide/scaling-up/ssr, Tooling https://vuejs.org/guide/scaling-up/tooling, Accessibility https://vuejs.org/guide/best-practices/accessibility, Performance https://vuejs.org/guide/best-practices/performance, Security https://vuejs.org/guide/best-practices/security, Built-in Directives https://vuejs.org/api/built-in-directives

## Version (verified 2026-11-11)

| package | latest stable | published (registry `time`) | licence | notes |
|---|---|---|---|---|
| `vue` | **3.5.45** | 2026-11-05 | MIT | 3.5.0 published 2024-09-03 (blog "Announcing Vue 3.5", 2024-09-01). Pre-release tags: `rc` 3.6.0-rc.14, `beta` 3.6.0-beta.17 — **3.6 (incl. Vapor Mode) is not stable**; do not write rules that assume it. |
| `eslint-plugin-vue` | **10.12.1** | 2026-11-09 | MIT | flat configs `flat/essential`, `flat/strongly-recommended`, `flat/recommended` (+ `-error` variants; `flat/vue2-*` for Vue 2) |
| `@vitejs/plugin-vue` | 6.0.10 | – | MIT | detection signal |
| `pinia` | 4.1.0 | – | MIT | official store; Vuex is in maintenance mode |
| `eslint-plugin-vuejs-accessibility` | 2.6.3 | 2026-10-21 | MIT | **community** plugin (vue-a11y), not by the Vue core team |

## Stack detection

| signal | meaning |
|---|---|
| `vue` in `dependencies` | Vue app or library (high) |
| `nuxt` in deps | Nuxt → also apply `nuxt.md` |
| `*.vue` single-file components | Vue SFCs (high) |
| `@vitejs/plugin-vue` + `vite.config.{js,ts,mjs,mts}` | Vite + Vue (official recommendation, scaffolded by `create-vue`) |
| `@vue/cli-service` / `vue.config.js` | Vue CLI: docs say maintenance mode; suggest Vite |
| `vue` major `2.x` | Vue 2 (EOL; blog "Vue 2 is Approaching End Of Life", 2023-12-15): use `flat/vue2-*` configs, most Composition rules differ |
| `pinia` / `vuex` in deps | store in use; Vuex is maintenance mode (docs) |
| `vue-router` | client routing: route-change focus rule applies |
| `<script setup>` in SFCs vs `export default {` | Composition API vs Options API (rules below marked where API-specific) |
| `eslint-plugin-vue` in devDeps, `eslint.config.*` | static check available |

## Static check: eslint-plugin-vue 10.12.1

Docs: "The Vue team maintains eslint-plugin-vue" (https://vuejs.org/guide/scaling-up/tooling#linting). Config membership below read from `dist/configs/vue3-*.js` in the tarball.

| rule | in config |
|---|---|
| `vue/multi-word-component-names`, `vue/require-v-for-key`, `vue/valid-v-for`, `vue/no-use-v-if-with-v-for`, `vue/no-mutating-props`, `vue/no-side-effects-in-computed-properties`, `vue/no-async-in-computed-properties`, `vue/no-ref-as-operand`, `vue/no-watch-after-await`, `vue/no-lifecycle-after-await`, `vue/no-v-text-v-html-on-component`, `vue/no-reserved-component-names`, `vue/no-export-in-script-setup`, `vue/no-dupe-keys` | essential |
| `vue/require-prop-types`, `vue/require-default-prop`, `vue/require-explicit-emits` | strongly-recommended |
| `vue/no-v-html` | recommended |
| `vue/no-setup-props-reactivity-loss`, `vue/no-ref-object-reactivity-loss`, `vue/no-unused-refs`, `vue/no-template-target-blank`, `vue/prefer-use-template-ref` | exist, not in any preset (opt-in) |

## Components (Style Guide)

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `vue/multi-word-names` | Name every user component with two or more words (except the root `App`). | Avoids clashing with current and future single-word HTML elements. | Style Guide A, #use-multi-word-component-names | Vue | static: `vue/multi-word-component-names` | `Item.vue` → `TodoItem.vue` | – | error |
| `vue/detailed-props` | Declare props with types (and validation where useful), not as a bare string array. | Documents the API and gives dev warnings. | Style Guide A, #use-detailed-prop-definitions | Vue | static: `vue/require-prop-types` | `props: ['status']` → `defineProps<{status: Status}>()` | – | warning |
| `vue/scoped-styles` | Scope component styles (`scoped`, CSS modules or a naming convention); keep global styles only in `App` and layouts. | Prevents style leakage between components. | Style Guide A, #use-component-scoped-styling | Vue SFC | static: non-App/layout SFC with unscoped `<style>` and no module | `<style>` → `<style scoped>` | – | warning |
| `vue/explicit-emits` | Declare emitted events with `defineEmits`/`emits`. | Clear API; avoids native-event fallthrough confusion. | eslint-plugin-vue `require-explicit-emits` (strongly-recommended) | Vue 3 | static: lint rule | `emit('save')` undeclared → `defineEmits(['save'])` | – | warning |
| `vue/no-mutate-props` | Never mutate a prop (or a prop object's fields) in the child; emit an event or copy to local state/computed. | One-way data flow; Vue warns props are readonly. | Props, #one-way-data-flow, #mutating-object-array-props | Vue | static: `vue/no-mutating-props` | `props.count++` → `emit('update:count', …)` | – | error |
| `vue/simple-template-expressions` | Keep template expressions simple; move complex logic to computed properties or methods. | Readability and reuse. | Style Guide B, #simple-expressions-in-templates | Vue | manual / static heuristic: long expressions in `{{ }}` | – | – | info |
| `vue/self-closing-and-casing` | Use PascalCase component names in SFC templates and self-close empty components, consistently. | Distinguishes components from HTML elements. | Style Guide B, #component-name-casing-in-templates, #self-closing-components | Vue SFC | static: `vue/component-name-in-template-casing`, `vue/html-self-closing` (strongly-recommended; names not re-checked, see Not verified) | – | – | info |
| `vue/no-implicit-parent-child` | Prefer props and events over `this.$parent` or mutating parent state from children. | Implicit coupling is hard to follow. | Style Guide D, #implicit-parent-child-communication | Vue | static: `$parent` use | `this.$parent.x = 1` → emit | – | warning |

## Reactivity and state

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `vue/prefer-ref` | Use `ref()` as the main way to declare reactive state. | `reactive()` cannot hold primitives, can't be replaced, and loses reactivity on destructure. | Reactivity Fundamentals, #limitations-of-reactive | Vue 3 Composition | manual / info | – | – | info |
| `vue/no-destructure-reactive` | Do not destructure a `reactive()` object or props into plain locals (or pass a primitive property to a function) and expect it to stay reactive; use `toRefs`, a getter, or pass the whole object. | The local is a disconnected copy. | Reactivity Fundamentals, #limitations-of-reactive | Vue 3 | static: `vue/no-setup-props-reactivity-loss`, `vue/no-ref-object-reactivity-loss` (opt-in) | `const { count } = state` → `toRefs(state)` | – | warning |
| `vue/no-replace-reactive` | Never reassign a variable holding a `reactive()` object; mutate its properties or use a `ref`. | The old proxy stays tracked; new one isn't. | Reactivity Fundamentals, #limitations-of-reactive | Vue 3 | static: `let x = reactive(` later reassigned | `state = reactive({…})` → `Object.assign(state, …)` or `ref` | – | error |
| `vue/ref-value-in-script` | Use `.value` for refs in script (templates unwrap top-level refs only). | Using a ref as an operand gives wrong results. | Reactivity Fundamentals, #caveat-when-unwrapping-in-templates | Vue 3 | static: `vue/no-ref-as-operand` | `count + 1` → `count.value + 1` | – | error |
| `vue/computed-pure` | Keep computed getters pure: no state mutation, async requests or DOM changes. | Computeds are cached derivations. | Computed, #getters-should-be-side-effect-free | Vue | static: `vue/no-side-effects-in-computed-properties`, `vue/no-async-in-computed-properties` | fetch in computed → watcher | – | error |
| `vue/no-mutate-computed` | Treat computed results as read-only; change their source state instead. | Mutating a snapshot is lost on next recompute. | Computed, #avoid-mutating-computed-value | Vue | static (heuristic): `.value.push` on a computed | – | – | warning |
| `vue/composable-returns-refs` | Return a plain object of refs from composables (not a `reactive()`), so callers can destructure. | Destructuring a reactive return loses reactivity. | Composables, #return-values | Vue 3 | static: `return reactive(` in `use*` function | `return reactive({x,y})` → `return {x,y}` | – | warning |
| `vue/composable-sync-setup` | Call composables synchronously in `<script setup>`/`setup()`, not after `await`; same for `watch` and lifecycle hooks. | They need the active component instance. | Composables, #usage-restrictions | Vue 3 | static: `vue/no-watch-after-await`, `vue/no-lifecycle-after-await` | `await x; onMounted()` → register before await | – | error |
| `vue/watcher-cleanup` | Clean up async work in watchers with `onWatcherCleanup()` (3.5+, before any `await`) or the `onCleanup` argument. | Stale responses overwrite fresh state. | Watchers, #side-effect-cleanup | Vue 3 | manual / heuristic: `fetch` in `watch` callback without cleanup | – | – | warning |
| `vue/deep-watch-caution` | Use deep watchers only when needed. | They traverse the whole object; costly on large data. | Watchers, #deep-watchers | Vue | static: `deep: true` on large-list sources (info) | – | – | info |
| `vue/pinia-for-shared-state` | Use Pinia for shared app state in new projects; Vuex is in maintenance mode. | Official, typed, SSR-aware. | State Management, #pinia | Vue | static: `vuex` dependency (info) | – | `pinia@4.1.0`, MIT (registry; size not checked) | info |

## Templates and lists

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `vue/v-for-key` | Always give `v-for` items a unique, stable `:key` (on `<template v-for>`, put it on the `<template>`). | In-place patching breaks child state and inputs when order changes. | Style Guide A, #use-keyed-v-for; List, #maintaining-state-with-key | Vue | static: `vue/require-v-for-key`, `vue/valid-v-for` | `v-for="t in todos"` → `:key="t.id"` | – | error |
| `vue/no-v-if-with-v-for` | Never put `v-if` and `v-for` on the same element; filter with a computed list, or move `v-if` to a wrapper. | `v-if` runs first and can't see the loop variable (Vue 3). | Style Guide A, #avoid-v-if-with-v-for; List, #v-for-with-v-if | Vue | static: `vue/no-use-v-if-with-v-for` | `v-for="u in users" v-if="u.active"` → `v-for="u in activeUsers"` | – | error |
| `vue/no-v-html-on-component` | Do not use `v-html`/`v-text` on components. | Overwrites the component's content. | eslint-plugin-vue `no-v-text-v-html-on-component` (essential) | Vue | static: lint rule | – | – | error |
| `vue/no-vhtml-for-composition` | Do not try to compose templates with `v-html`; use components. Note scoped styles don't reach `v-html` content. | Template syntax inside is not compiled. | Built-in Directives, `v-html` | Vue | manual | – | – | info |

## Rendering modes: SSR and hydration

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `vue/ssr-valid-html-nesting` | Produce valid HTML nesting (e.g. no `<div>` in `<p>`). | Browser parser rewrites it, causing hydration mismatch. | SSR, #hydration-mismatch | Vue SSR | static: invalid nesting in SFC templates | `<p><div>` → `<div><div>` | – | error |
| `vue/ssr-no-random-or-tz-in-render` | Don't render random values or local-time conversions on the server; render them client-only (`v-if` + `onMounted`) or seed them. | Server and client output differ. | SSR, #hydration-mismatch | Vue SSR | static (heuristic): `Math.random()`/`toLocale*` in setup/template | – | – | warning |
| `vue/ssr-allow-mismatch-sparingly` | Use `data-allow-mismatch` (3.5+) only for unavoidable differences. | Hides real bugs. | SSR, #suppressing-hydration-mismatches | Vue ≥3.5 SSR | static: count of `data-allow-mismatch` | – | – | info |
| `vue/ssr-no-cross-request-state` | Don't keep per-user state in module-level singletons on the server; create state per request (Pinia handles this). | Leaks one user's data to another request. | SSR, #cross-request-state-pollution | Vue SSR | static: module-scope `reactive(`/`ref(` in shared modules imported by SSR code | – | – | error |
| `vue/ssr-side-effects-in-mounted` | Put timers, subscriptions and browser API access in `onMounted`, not in `setup()` root. | Unmount hooks never run on the server, so timers leak; browser globals don't exist. | SSR, #component-lifecycle-hooks, #access-to-platform-specific-apis | Vue SSR | static: `setInterval(`/`window.` at `<script setup>` top level | – | – | error |

## Accessibility (Vue accessibility guide)

The guide (https://vuejs.org/guide/best-practices/accessibility) references WCAG 2.1 and WAI-ARIA; our rules target WCAG 2.2 AA via the general `a11y` area. Vue has no built-in route announcer; the guide shows focus management with vue-router instead.

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `vue/skip-link` | Put a "skip to main content" link as the first focusable element (e.g. top of `App.vue`). | Keyboard users skip repeated navigation. | Accessibility, #skip-link | Vue | static: no `href="#main"`-style link in App.vue/layout | – | – | warning |
| `vue/focus-on-route-change` | After a client-side route change, move focus to the top of the page (before the skip link). | SPA navigations otherwise leave focus and screen readers stranded. | Accessibility, #skip-link | Vue + vue-router | manual / runtime | – | – | warning |
| `vue/heading-order` | Use real heading elements in rank order without skipping levels. | Users navigate by headings. | Accessibility, #headings | Vue | runtime: axe `heading-order` | styled `<div>` → `<h2>` | – | warning |
| `vue/form-labels` | Label every form control (`<label for>`/`id`, or `aria-label`/`aria-labelledby`), and do not rely on placeholders. | Placeholders vanish and often fail contrast. | Accessibility, #labels, #placeholder | Vue | static: `<input>` without label association; runtime: axe `label` | placeholder-only → `<label>` | eslint-plugin-vuejs-accessibility@2.6.3, MIT (community) | error |
| `vue/button-type` | Set `type="button"` on non-submit buttons inside forms. | Default type submits the form. | Accessibility, #buttons | Vue | static: `<button>` in `<form>` without `type` | – | – | warning |
| `vue/landmarks` | Use landmark elements (`header`, `nav`, `main`, `footer`) or roles for page regions. | Lets users jump between regions. | Accessibility, #landmarks | Vue | runtime: axe `region`/`landmark-*` | – | – | info |

## Performance

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `vue/stable-props` | Pass children props that change only when their output changes (e.g. `:active="item.id === activeId"` instead of `:active-id`). | Otherwise every list item re-renders. | Performance, #props-stability | Vue | manual | – | – | info |
| `vue/v-memo-rarely` | Use `v-memo` only for measured hot spots such as `v-for` lists over ~1000 items, on the same element as `v-for`, with a correct dependency array. | Wrong deps skip needed updates; it does not work inside `v-for`. | Built-in Directives, `v-memo`; Performance, #v-memo | Vue ≥3.2 | static: `v-memo` on a child of a `v-for` element (error) | – | – | warning |
| `vue/shallow-for-large-immutable` | Use `shallowRef`/`shallowReactive` for large, deeply nested data you replace rather than mutate. | Deep proxies cost on every property access. | Performance, #reduce-reactivity-overhead-for-large-immutable-structures | Vue 3 | manual | `ref(hugeArray)` → `shallowRef` + replace | – | info |
| `vue/virtualize-long-lists` | Virtualize lists with thousands of rows. | DOM size dominates render cost. | Performance, #virtualize-large-lists | Vue | manual / runtime: Lighthouse `dom-size` | – | vue-virtual-scroller (docs-listed; size/licence not checked) | info |
| `vue/code-split-routes` | Lazy-load route components and heavy components with dynamic `import()` / `defineAsyncComponent`. | Smaller initial bundle. | Performance, #code-splitting; Async Components | Vue | static: static imports of all route views in router | `import View from` → `() => import(…)` | – | info |
| `vue/lazy-hydration` | In SSR, give below-the-fold async components a hydration strategy (`hydrateOnVisible`, `hydrateOnIdle`, `hydrateOnInteraction`, `hydrateOnMediaQuery`). | Less main-thread work at startup. | Async Components, #lazy-hydration | Vue ≥3.5 SSR | manual | – | – | info |
| `vue/vite-over-vue-cli` | Use Vite (create-vue) rather than Vue CLI for new or migrated projects. | Vue CLI is in maintenance mode. | Tooling, #vue-cli | Vue | static: `@vue/cli-service` | – | – | info |

## Security

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `vue/no-untrusted-templates` | Never use user-provided content as a Vue template (runtime compile, `template:` string). | Equals arbitrary JS execution, also on the server in SSR. | Security, #rule-no-1-never-use-non-trusted-templates | Vue | static: `template:` / `compile(` with non-literal input | – | – | error |
| `vue/no-v-html-user-content` | Use `v-html` (and `innerHTML` in render functions/JSX) only for trusted content, never raw user input. | XSS. | Security, #html-injection; Built-in Directives `v-html` | Vue | static: `vue/no-v-html` (recommended); flag non-literal sources | `v-html="comment.body"` → text interpolation or sanitized HTML | DOMPurify (size not checked) | error |
| `vue/sanitize-urls-server-side` | Sanitize user-provided URLs on the backend before storing; never bind them raw to `href`/`src`. | `javascript:` URLs execute script. | Security, #url-injection | Vue | static: `:href` bound to user data (heuristic) | – | – | warning |
| `vue/no-user-styles` | Don't bind user-provided style objects/strings; allow only specific safe properties. | Click-jacking overlays. | Security, #style-injection | Vue | manual | `:style="userStyles"` → whitelisted props | – | warning |
| `vue/no-script-or-event-strings` | Don't render `<script>` from templates and don't bind user strings to `on*` attributes. | JS injection. | Security, #javascript-injection | Vue | static: `<script>` inside template; `:onclick` with string | – | – | error |
| `vue/target-blank` | Add `rel="noopener noreferrer"` to `target="_blank"` links to external sites (opt-in rule). | Reverse tabnabbing in old browsers. | eslint-plugin-vue `no-template-target-blank` | Vue | static: lint rule | – | – | info |

## Notes for skill authors

- Short skill: Style Guide A (multi-word names, typed props, keyed `v-for`, no `v-if`+`v-for`, scoped styles), reactivity caveats (destructure/replace reactive, `.value`), pure computeds, `v-html` rule, SSR hydration causes. Static check: `eslint-plugin-vue` `flat/recommended` (it includes essential + strongly-recommended).
- Reference file: v-memo details, lazy hydration strategies, the a11y guide checklist, security sub-sections.
- Noisy: `vue/no-v-html` fires on trusted CMS HTML too; keep severity tied to whether the source is user data. Style rules (casing, self-closing) are taste: info only.
- Controversial: Options vs Composition API (docs support both; don't flag either). `prefer-ref` is a recommendation, not an error.
- Changes often: Vue 3.6 / Vapor Mode is in RC (3.6.0-rc.14 on npm today); when 3.6 goes stable, recheck lazy hydration, reactivity and new APIs. eslint-plugin-vue ships often (10.12.1 on 2026-11-09).
- Accessibility: the guide is solid on forms, headings and skip links but cites WCAG 2.1; map to WCAG 2.2 in the `a11y` area. Automated checks find only part of the problems; focus management after route change needs a person to test.

## AI-agent resources

- `https://vuejs.org/llms.txt` (index; every page has a `.md` twin) and `https://vuejs.org/llms-full.txt` (HTTP 200 on 2026-11-11).
- No official Vue MCP server or agent rules file found on vuejs.org.

## Not verified

- Release date of Vue 3.5.45 from a GitHub release page: only the npm `time` field (2026-11-05) was read.
- `vue/component-name-in-template-casing` and `vue/html-self-closing` rule names and preset membership were not re-checked in the tarball.
- Sizes for DOMPurify, pinia, vue-virtual-scroller: not fetched from bundlephobia/pkg-size.
- `eslint-plugin-vuejs-accessibility` rule names (e.g. `form-control-has-label`): not opened.
- Vue 2 EOL date: only the 2023-12-15 blog title was seen, not the post body.
