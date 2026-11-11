---
id: svelte/kit-page-title
title: Every SvelteKit page sets its own descriptive title in svelte:head, or its layout renders a title from page data.
severity: serious
check: static
applies:
  - project
stack:
  - sveltekit
wcag:
  - 2.4.2
level: A
skill: fe-sveltekit
since: 0.1.0
sources:
  - title: SvelteKit docs, Accessibility (route announcements)
    url: https://svelte.dev/docs/kit/accessibility
  - title: WCAG 2.2, Understanding SC 2.4.2 Page Titled
    url: https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html
  - title: SvelteKit docs, SEO (title and meta)
    url: https://svelte.dev/docs/kit/seo
---

## Why

After a client-side navigation SvelteKit announces the new page to screen readers by reading its `<title>`. A page without its own title keeps the previous page's title (or the layout's single title): the announcement, the browser tab, the history entry and the search result all name the wrong page.

## Fix

Put `<svelte:head><title>Orders – Example Shop</title></svelte:head>` in each `+page.svelte`, most specific part first. For many pages, return `title` from `load` and render `<title>{page.data.title}</title>` once in `+layout.svelte` (with `page` from `$app/state`). An SEO component that receives a `title` prop counts.

## Examples

```svelte
<!-- bad: src/routes/orders/+page.svelte -->
<h1>Your orders</h1>
<!-- good -->
<svelte:head><title>Your orders – Example Shop</title></svelte:head>
<h1>Your orders</h1>
```
