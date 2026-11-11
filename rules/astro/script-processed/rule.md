---
id: astro/script-processed
title: Astro script tags carry no attribute but src so they are bundled; is:inline only on purpose, data-* instead of define:vars.
severity: moderate
check: static
applies:
  - astro
stack:
  - astro
skill: fe-astro
since: 0.1.0
sources:
  - title: Astro docs, Scripts and event handling (script processing)
    url: https://docs.astro.build/en/guides/client-side-scripts/
  - title: Astro docs, Template directives reference (is:inline, define:vars)
    url: https://docs.astro.build/en/reference/directives-reference/
---

## Why

Astro bundles a `<script>` that has no attribute other than `src`: TypeScript works, npm imports resolve, and the script is included once per page however many times the component appears. Any other attribute, `type="module"` included, silently turns this off: the code is copied into the HTML as written, once per component instance, with no TypeScript and no imports. `define:vars` on a script does the same.

## Fix

Remove the extra attribute; processed scripts are already modules. Pass server values through `data-*` attributes on an element and read them with `element.dataset` (or define a custom element). When a script must stay inline (an analytics snippet that has to run before anything else), write `is:inline` so the choice is visible. JSON-LD and other data blocks are not scripts and are fine.

## Examples

```astro
<!-- bad -->
<script type="module">import confetti from 'canvas-confetti'; confetti()</script>
<script define:vars={{ apiUrl }}>fetch(apiUrl)</script>
<!-- good -->
<div id="feed" data-api-url={apiUrl}></div>
<script>
  import confetti from 'canvas-confetti'
  const feed = document.getElementById('feed')
  if (feed) fetch(feed.dataset.apiUrl!).then(() => confetti())
</script>
```
