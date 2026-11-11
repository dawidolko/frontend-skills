---
id: seo/title-unique
title: Each page has its own descriptive title, page topic first and site name last, in the page's language.
severity: minor
check: manual
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
lighthouse:
  - document-title
skill: fe-seo-metadata
since: 0.1.0
sources:
  - title: Deque University, axe rule document-title (used by Lighthouse)
    url: https://dequeuniversity.com/rules/axe/4.10/document-title
  - title: WCAG 2.2, Understanding SC 2.4.2 Page Titled
    url: https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html
---

## Why

The title is the clickable line in search results, the browser tab name and the first thing a screen reader says. "Home · Acme" on every page, or one generic title from the root layout, makes results and tabs indistinguishable.

## Fix

Set the title per route through the framework (Next.js `metadata.title` with a `template` in the root layout, Nuxt `useHead({ title })` with `titleTemplate`, SvelteKit `<svelte:head><title>`, Angular route `title` and a `TitleStrategy`). Put the page topic first and the site name last; avoid repeating keywords.

## Examples

```js
// Next.js: app/layout.tsx and app/pricing/page.tsx
export const metadata = { title: { template: '%s · Acme', default: 'Acme' } }
export const metadata = { title: 'Pricing' } // renders "Pricing · Acme"
```
