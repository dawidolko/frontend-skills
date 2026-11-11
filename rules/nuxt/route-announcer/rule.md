---
id: nuxt/route-announcer
title: The app renders NuxtRouteAnnouncer (in app.vue or a layout) so client-side page changes are announced.
severity: moderate
check: static
applies:
  - project
stack:
  - nuxt
wcag:
  - 4.1.3
level: AA
skill: fe-nuxt
since: 0.1.0
sources:
  - title: Nuxt docs, NuxtRouteAnnouncer
    url: https://nuxt.com/docs/4.x/api/components/nuxt-route-announcer
  - title: Nuxt docs, Accessibility (route announcements)
    url: https://nuxt.com/docs/4.x/guide/best-practices/accessibility
---

## Why

After the first load, Nuxt changes pages without a browser navigation. A screen reader user who follows a link hears nothing: no new page title, no sign that the content changed, and keeps reading where they were.

## Fix

Render `<NuxtRouteAnnouncer />` once, in `app.vue` or in every layout. It announces the new page's title in a polite live region, so give each page a distinct title with `useHead` or `useSeoMeta`. Move focus to the main heading or `<main>` as well when the design allows.

## Examples

```vue
<!-- good: app.vue -->
<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout><NuxtPage /></NuxtLayout>
</template>
```
