---
id: a11y/focus-route-change
title: After a client-side route change, focus moves to the new page's heading or main region and the new title is announced.
severity: moderate
check: manual
applies:
  - page
wcag:
  - 2.4.3
  - 4.1.3
level: A
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.4.3 Focus Order
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
  - title: Next.js, accessibility (route announcements)
    url: https://nextjs.org/docs/architecture/accessibility
  - title: Nuxt, NuxtRouteAnnouncer component
    url: https://nuxt.com/docs/api/components/nuxt-route-announcer
  - title: SvelteKit, accessibility (route announcements, focus management)
    url: https://svelte.dev/docs/kit/accessibility
---

## Why

In a single-page app the browser does not reload, so focus stays on the link that was clicked (or falls to `<body>`) and a screen reader says nothing. The person does not know the page changed.

## Fix

Use the framework's announcer where it exists (Next.js and SvelteKit announce route changes; Nuxt has `<NuxtRouteAnnouncer>`). Then move focus: after navigation, focus the new page's `<h1 tabindex="-1">` or `<main tabindex="-1">`. Keep each route's `<title>` unique, because announcers read it.

## Examples

```js
// good (Angular): focus the main heading after navigation
router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
  document.querySelector('main h1')?.focus()
})
```
