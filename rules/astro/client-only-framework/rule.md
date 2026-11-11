---
id: astro/client-only-framework
title: Give client:only the framework of the component (client:only="react"), and a fallback slot for the space it fills.
severity: moderate
check: static
applies:
  - astro
stack:
  - astro
skill: fe-astro
since: 0.1.0
sources:
  - title: Astro docs, Template directives reference (client:only)
    url: https://docs.astro.build/en/reference/directives-reference/
---

## Why

`client:only` skips server rendering, so Astro never runs the component at build time and cannot find out which framework renderer it needs. Without the value the island cannot be hydrated correctly, and with no fallback the space stays empty until the script runs, which shifts the layout.

## Fix

Name the framework: `client:only="react"` (or `preact`, `vue`, `svelte`, `solid-js`). Put placeholder content with `slot="fallback"` inside the component so the page reserves the space. Prefer `client:load`, `client:idle` or `client:visible` when the component can render on the server.

## Examples

```astro
<!-- bad -->
<Map client:only />
<!-- good -->
<Map client:only="react"><p slot="fallback">Loading the map…</p></Map>
```
