---
id: svelte/kit-app-state
title: Read page, navigating and updated from $app/state, not the $app/stores module that SvelteKit 3 removed.
severity: moderate
check: static
applies:
  - svelte
  - jsx
stack:
  - sveltekit
skill: fe-sveltekit
since: 0.1.0
sources:
  - title: SvelteKit docs, Migrating to SvelteKit v3 ($app/stores removed)
    url: https://svelte.dev/docs/kit/migrating-to-sveltekit-3
  - title: SvelteKit docs, $app/state
    url: https://svelte.dev/docs/kit/$app-state
---

## Why

`$app/stores` was the Svelte 4 store version of the page state. SvelteKit 3 removed it, so an import breaks the build after the upgrade, and on Kit 2 the store does not take part in Svelte 5's fine-grained reactivity. Agents still write `$page` from older examples.

## Fix

`import { page, navigating, updated } from '$app/state'` and drop the `$` prefix: `$page.url.pathname` becomes `page.url.pathname`. These are read-only state objects, so read them in markup or in `$derived`. `npx sv migrate sveltekit-3` rewrites most imports.

## Examples

```svelte
<!-- bad -->
<script>
  import { page } from '$app/stores'
</script>
<a href="/docs" aria-current={$page.url.pathname === '/docs' ? 'page' : undefined}>Docs</a>
<!-- good -->
<script>
  import { page } from '$app/state'
</script>
<a href="/docs" aria-current={page.url.pathname === '/docs' ? 'page' : undefined}>Docs</a>
```
