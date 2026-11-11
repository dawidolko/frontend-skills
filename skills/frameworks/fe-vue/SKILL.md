---
name: fe-vue
description: Writes and reviews Vue 3.5 single-file components with script setup and the Composition API - keyed lists, props and emits, refs and reactive, pure computeds, watchers with cleanup, navigation links - so they stay reactive, correct and accessible. Use when creating or editing a .vue file or a composable, fixing a value that does not update, or when asked to review Vue code.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Vue components
  area: frameworks
  lane: B
  requires: vue nuxt
  globs: "**/*.vue src/composables/**/*.ts src/composables/**/*.js"
  rules: "vue/require-v-for-key vue/no-index-key vue/no-v-if-with-v-for vue/no-mutating-props vue/ref-value-in-script vue/no-reactivity-loss vue/computed-pure vue/detailed-props vue/multi-word-names vue/link-for-navigation a11y/no-click-on-static a11y/input-label"
  version: 0.1.0
---

# Vue components

Read `.frontend-skills/profile.json` (Vue version, Nuxt, store, TypeScript) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Key every `v-for` with an id from the item (vue/require-v-for-key), never the loop index for a list that changes (vue/no-index-key).
- Never put `v-if` and `v-for` on one element; loop over a computed list (vue/no-v-if-with-v-for).
- Never change a prop; emit, use `defineModel()`, or copy to local state (vue/no-mutating-props).
- In script code read refs and computeds through `.value` (vue/ref-value-in-script).
- Never destructure or reassign a `reactive()` object; use `ref`, `toRefs` or `Object.assign` (vue/no-reactivity-loss).
- Computed getters only derive: no async, requests or writes (vue/computed-pure).
- Type props (`defineProps<{...}>()` or objects with `type`), never a bare name array (vue/detailed-props).
- Name components with two or more words (vue/multi-word-names).
- Navigate with `RouterLink`/`NuxtLink`, not a button that calls `router.push` (vue/link-for-navigation).
- Clicks go on `<button>` or links (a11y/no-click-on-static); every field has a label (a11y/input-label).
- Register composables, `watch` and lifecycle hooks synchronously in setup; clean up what a watcher or `onMounted` starts.

## Do this

1. Check the profile: Vue 3.5 (`useId`, `useTemplateRef`, `onWatcherCleanup`, reactive props destructure, lazy hydration); Nuxt adds `fe-nuxt`; stores follow `fe-state`.
2. Write `<script setup lang="ts">`; declare `defineProps`, `defineEmits` (typed) and `defineModel` for two-way bindings. Options API code stays Options API unless the task is a migration.
3. Use `ref` for state, `computed` for derived values, `watch` with `onWatcherCleanup` or an `AbortController` for side effects; `shallowRef` for large data you replace.
4. Extract reusable logic into `useX()` composables in `composables/` that take refs or getters and return plain objects of refs.
5. Use `useId()` for `id`/`for`/`aria-describedby`; move focus to the page heading after a route change; bind text with `{{ }}`; `v-html` only for sanitized HTML (see `fe-security`).
6. Images and media: import them or use `@/assets` paths (js/asset-import); icons from the project set (html/project-icons, html/icon-from-set).
7. Split routes and heavy widgets with `() => import(...)` and `defineAsyncComponent`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports missing and index keys, `v-if` with `v-for`, prop mutation, refs without `.value`, lost reactivity, impure computeds, untyped props and single-word names.
- Run ESLint with `eslint-plugin-vue` `flat/recommended` and `vue-tsc --noEmit`; never silence a rule to pass.
- Vue DevTools: watch the component tree and the timeline for components that re-render on unrelated changes.

## References

- [references/vue.md](references/vue.md): reactivity rules, script setup macros, watchers, composables, SSR and hydration, accessibility, performance, Vue 2 differences. Read it for a new component, a composable, a reactivity bug or a Vue 2 migration.
