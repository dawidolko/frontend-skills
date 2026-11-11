# Vue reference

Depth for the `fe-vue` skill, for Vue 3.5 (latest stable on the npm registry, checked 2026-11-11: 3.5.45; 3.6 with Vapor Mode is a release candidate and not covered). Rule ids in brackets: `frontend-skills explain <id>`.

## Reactivity

| You have | Use | Watch out for |
| --- | --- | --- |
| A value that changes | `ref(value)`; `.value` in script, plain name in template [vue/ref-value-in-script] | Only top-level refs unwrap in templates: `{{ obj.count + 1 }}` with `obj.count` a ref needs `.value` |
| A group of fields edited together | `reactive({...})` or one `ref({...})` | Destructuring or reassigning a `reactive` loses reactivity [vue/no-reactivity-loss] |
| A value derived from others | `computed(() => ...)`, pure [vue/computed-pure] | Never mutate a computed's result; change its source |
| Large data you replace, not mutate | `shallowRef`, then `data.value = next` | Deep changes are not tracked |
| Part of a reactive object for a composable | `toRef(state, 'x')`, `toRefs(state)` or a getter `() => state.x` | A plain property read is a snapshot |
| Props | `const { size = 'md' } = defineProps<...>()` (reactive since 3.5) | Pass to `watch` as `() => size`, not `size` |

## script setup macros

| Macro | Use |
| --- | --- |
| `defineProps<{ ... }>()` | Typed props; defaults with destructuring (3.5) or `withDefaults` [vue/detailed-props] |
| `defineEmits<{ save: [id: string] }>()` | Declared events; emit instead of changing props [vue/no-mutating-props] |
| `defineModel()` | A two-way `v-model` prop and its `update:` event in one ref |
| `defineExpose({ focus })` | What a parent may call through a template ref |
| `defineSlots`, `defineOptions` | Typed slots; `name` and `inheritAttrs` without a second script block |
| `useTemplateRef('input')` (3.5) | Template refs by name, also for dynamic refs |
| `useId()` (3.5) | Ids that match between server and client, for `for`, `aria-describedby` |

## Lists and conditions

- `:key` from the data on every `v-for`, on `<template v-for>` itself in Vue 3 [vue/require-v-for-key] [vue/no-index-key].
- Filter in a computed (`activeUsers`) instead of `v-if` on the looping element [vue/no-v-if-with-v-for].
- `v-show` for frequent toggles (kept in the DOM, hidden with CSS); `v-if` for rarely shown content.
- `v-memo` only for measured hot lists (thousands of rows), on the `v-for` element, with the right dependencies.

## Watchers and side effects

```js
watch(query, async (q) => {
  const controller = new AbortController()
  onWatcherCleanup(() => controller.abort()) // 3.5; call before any await
  results.value = await getJson(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
})
```

- `watch` for a reaction to a specific source; `watchEffect` when the dependencies are whatever the callback reads.
- Register `watch`, `onMounted` and composables synchronously; after an `await` in a plain `setup()` the instance is gone. `<script setup>` keeps it for top-level `await`.
- Remove listeners, timers and observers in `onUnmounted` (js/listener-cleanup).

## Composables

- Name them `useX`, accept refs, getters or plain values (`toValue(input)`), return a plain object of refs so callers can destructure.
- Keep app-wide state in a store (Pinia, see `fe-state`); a module-level `ref` is shared by every user on a server (nuxt/no-module-scope-state).

## Components

| Do | Why |
| --- | --- |
| Two-word names: `AppHeader`, `TodoItem` [vue/multi-word-names] | Single words clash with HTML elements |
| PascalCase in SFC templates, self-closing when empty | Components stand out from elements |
| Scoped styles (`<style scoped>` or CSS modules) outside `App.vue` and layouts | No leaks between components |
| Props down, events up; no `$parent`, no shared mutable props | One-way data flow |
| `RouterLink`/`NuxtLink` for navigation [vue/link-for-navigation] | Real links: new tab, prefetch, announced as link |

## SSR and hydration (Vue SSR, Nuxt)

| Cause of a mismatch | Fix |
| --- | --- |
| Browser APIs in setup | `onMounted`, `<ClientOnly>`, cookies (nuxt/no-browser-api-in-setup) |
| `Math.random()`, `Date.now()`, local time in render | Generate once on the server and pass it (`useState`), or render on the client |
| Invalid nesting (`<div>` in `<p>`, `<a>` in `<a>`) | Valid HTML; the parser rewrites invalid nesting before hydration |
| Unavoidable difference | `data-allow-mismatch` (3.5) on that element only |

Lazy hydration (3.5): `defineAsyncComponent({ loader, hydrate: hydrateOnVisible() })`; also `hydrateOnIdle`, `hydrateOnInteraction`, `hydrateOnMediaQuery`.

## Accessibility

- Native elements first: `<button>` for actions, `RouterLink` for navigation (a11y/no-click-on-static).
- Labels for every field, ids from `useId()` (a11y/input-label); errors linked with `aria-describedby`.
- Route changes: a skip link as the first focusable element; move focus to the new page's heading or `<main tabindex="-1">` in `router.afterEach`; give every route a title.
- `type="button"` on buttons inside forms that do not submit (html/button-type).

## Performance

- Route components as `() => import('./views/OrderView.vue')`; heavy widgets with `defineAsyncComponent`.
- Pass list items props that change only when their output does (`:active="item.id === activeId"`, not `:active-id`).
- Virtualise lists of thousands of rows; `shallowRef` for big read-only data.

## Vue 2 differences still met in old code

| Vue 2 | Vue 3 |
| --- | --- |
| `v-for` ran before `v-if` on one element | `v-if` runs first and cannot see the loop variable |
| `key` on the children of `<template v-for>` | `key` on the `<template>` |
| `this.$set`, `Vue.set` | Plain assignment; proxies track new keys |
| Filters (`{{ price \| currency }}`), `$listeners`, `$on` event bus | Functions or computeds; `$attrs`; a store or `mitt` |
| `.sync` modifier, `value`/`input` for `v-model` | `v-model:prop`, `modelValue`/`update:modelValue`, `defineModel()` |
| Vuex | Pinia (Vuex is in maintenance mode) |

## Sources

- Vue docs, Reactivity Fundamentals: https://vuejs.org/guide/essentials/reactivity-fundamentals
- Vue docs, Computed Properties: https://vuejs.org/guide/essentials/computed
- Vue docs, Watchers: https://vuejs.org/guide/essentials/watchers
- Vue docs, List Rendering: https://vuejs.org/guide/essentials/list
- Vue docs, Props: https://vuejs.org/guide/components/props
- Vue docs, Composition API helpers (useId, useTemplateRef): https://vuejs.org/api/composition-api-helpers
- Vue Style Guide, Priority A: https://vuejs.org/style-guide/rules-essential
- Vue docs, Server-Side Rendering: https://vuejs.org/guide/scaling-up/ssr
- Vue docs, Accessibility: https://vuejs.org/guide/best-practices/accessibility
- Vue docs, Security: https://vuejs.org/guide/best-practices/security
- Vue blog, Announcing Vue 3.5: https://blog.vuejs.org/posts/vue-3-5
- Vue Router, Programmatic navigation: https://router.vuejs.org/guide/essentials/navigation
- eslint-plugin-vue rules: https://eslint.vuejs.org/rules/
