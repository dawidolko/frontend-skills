---
id: astro/directive-on-framework-component
title: Put client:* directives only on UI framework components imported into the .astro file, never on Astro components.
severity: moderate
check: static
applies:
  - astro
stack:
  - astro
skill: fe-astro
since: 0.1.0
sources:
  - title: Astro docs, Template directives reference (client directives)
    url: https://docs.astro.build/en/reference/directives-reference/
  - title: Astro docs, Islands architecture
    url: https://docs.astro.build/en/concepts/islands/
---

## Why

An Astro component always renders to HTML on the server; it has no client runtime to hydrate. A `client:load` on `<Header />` imported from `Header.astro` is not supported: it does not make the header interactive, and the author believes it is. The documented rule is that a client directive belongs on a UI framework component (React, Preact, Vue, Svelte, Solid) imported directly into the `.astro` file.

## Fix

For small behaviour on an Astro component, add a `<script>` inside it (processed and bundled once per page), ideally defining a custom element. For stateful UI, write that part as a framework component and give it the directive where it is used.

## Examples

```astro
---
import Header from '../components/Header.astro'
import MenuToggle from '../components/MenuToggle.tsx'
---
<!-- bad -->
<Header client:load />
<!-- good -->
<Header />
<MenuToggle client:idle />
```
