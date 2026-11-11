---
id: a11y/page-title
title: Every HTML document has a title element that says what the page is about.
severity: serious
check: static
applies:
  - html
  - astro
wcag:
  - 2.4.2
level: A
axe:
  - document-title
skill: fe-html
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.4.2 Page Titled
    url: https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html
  - title: MDN, the title element
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title
---

## Why

The title is the first thing a screen reader announces and the label of the tab, the history entry and the bookmark. Search engines show it as the result heading.

## Fix

Add `<title>` inside `<head>`, most specific part first: `<title>Checkout – Example Shop</title>`. Frameworks set it through their metadata API (Next.js `metadata`, Nuxt `useHead`, SvelteKit `<svelte:head>`); this check reads only plain HTML and Astro documents, and skips a head that renders a component which may set the title.

## Examples

```html
<!-- bad -->
<head><meta charset="utf-8"></head>
<!-- good -->
<head><meta charset="utf-8"><title>Checkout – Example Shop</title></head>
```
