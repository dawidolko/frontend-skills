---
id: vue/multi-word-names
title: Name components with two or more words (TodoItem, not Item); App, pages and layouts are exempt.
severity: minor
check: static
applies:
  - project
stack:
  - vue
  - nuxt
skill: fe-vue
since: 0.1.0
sources:
  - title: Vue Style Guide, Priority A (use multi-word component names)
    url: https://vuejs.org/style-guide/rules-essential
  - title: eslint-plugin-vue, multi-word-component-names
    url: https://eslint.vuejs.org/rules/multi-word-component-names
---

## Why

HTML element names are single words, and new ones keep being added (`<search>` arrived in 2023). A component called `Header`, `Button` or `Dialog` is written `<header>`, `<button>` or `<dialog>` in in-DOM templates and kebab-case, where it is the native element, and a name like `Item` says nothing about what it is.

## Fix

Rename the file and its uses to two or more words: `AppHeader.vue`, `BaseButton.vue`, `TodoItem.vue`. A common prefix (`App`, `Base`, `The`) groups app-wide components. Route views (`pages/`, `views/`), layouts and the root `App.vue` are not used as tags and need no change.

## Examples

```text
bad:  components/Header.vue   components/Item.vue
good: components/AppHeader.vue   components/TodoItem.vue
```
