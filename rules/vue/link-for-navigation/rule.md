---
id: vue/link-for-navigation
title: Navigate with RouterLink or NuxtLink, not a button whose click handler only calls router.push or navigateTo.
severity: moderate
check: static
applies:
  - vue
stack:
  - vue
  - nuxt
wcag:
  - 4.1.2
level: A
skill: fe-vue
since: 0.1.0
sources:
  - title: Vue Router docs, Programmatic navigation (router.push is what RouterLink calls)
    url: https://router.vuejs.org/guide/essentials/navigation
  - title: Nuxt docs, Accessibility (links)
    url: https://nuxt.com/docs/4.x/guide/best-practices/accessibility
  - title: Nuxt docs, NuxtLink
    url: https://nuxt.com/docs/4.x/api/components/nuxt-link
---

## Why

A button that calls `router.push('/pricing')` is announced as a button, not a link, cannot be opened in a new tab, copied or middle-clicked, has no address on hover, and is not prefetched. Screen reader users who list the links of a page do not find it.

## Fix

Use `<RouterLink to="/pricing">` (Vue Router) or `<NuxtLink to="/pricing">` (Nuxt), and style it as a button if the design wants one. Keep `router.push` and `navigateTo` for navigation that follows an action, such as after a form is saved.

## Examples

```vue
<!-- bad -->
<button type="button" @click="router.push('/pricing')">See pricing</button>
<!-- good -->
<RouterLink to="/pricing" class="button">See pricing</RouterLink>
```
