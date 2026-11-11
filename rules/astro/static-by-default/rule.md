---
id: astro/static-by-default
title: Render framework components without a client directive unless they need interactivity, and pick the latest directive that works.
severity: moderate
check: manual
applies:
  - astro
stack:
  - astro
skill: fe-astro
since: 0.1.0
sources:
  - title: Astro docs, Template directives reference (client directives and their priority)
    url: https://docs.astro.build/en/reference/directives-reference/
  - title: Astro docs, Islands architecture
    url: https://docs.astro.build/en/concepts/islands/
---

## Why

A React, Vue or Svelte component used without a directive renders to HTML with no JavaScript. Each `client:*` directive adds the framework runtime and the component's code to the page, and `client:load` runs it at once, competing with the content the visitor came for. A footer, a card list or a static menu with `client:load` costs script and interaction delay for nothing.

## Fix

Remove the directive when the component only displays data. Otherwise choose by need: `client:load` for what must work at once above the fold, `client:idle` for lower priority, `client:visible` (with `rootMargin` if it should be ready slightly before scrolling into view) for content further down, `client:media` for UI that exists only at some widths. Review by hand: only the author knows whether the component is interactive and where it sits.

## Examples

```astro
<!-- bad -->
<Footer client:load />
<Comments client:load />
<!-- good -->
<Footer />
<Comments client:visible={{ rootMargin: '300px' }} />
```
