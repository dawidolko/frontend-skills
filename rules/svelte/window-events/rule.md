---
id: svelte/window-events
title: Listen to window and document events with svelte:window and svelte:document, not addEventListener in $effect or onMount.
severity: minor
check: static
applies:
  - svelte
stack:
  - svelte
  - sveltekit
skill: fe-svelte
since: 0.1.0
sources:
  - title: Svelte docs, Best practices (events)
    url: https://svelte.dev/docs/svelte/best-practices
  - title: Svelte docs, svelte:window
    url: https://svelte.dev/docs/svelte/svelte-window
---

## Why

A listener added by hand in `onMount` or `$effect` has to be removed by hand; forgetting the cleanup leaves handlers firing after the component is gone and doubles them when it comes back. The special elements add and remove the listener with the component and are safe in server rendering.

## Fix

`<svelte:window onkeydown={onKey} />`, `<svelte:document onvisibilitychange={sync} />`, and `bind:innerWidth`, `bind:scrollY` or `bind:online` on `<svelte:window>` for the common values. For an element listener that needs options, use an attachment (`{@attach}`) that returns its cleanup.

## Examples

```svelte
<!-- bad -->
<script>
  import { onMount } from 'svelte'
  onMount(() => window.addEventListener('keydown', onKey))
</script>
<!-- good -->
<svelte:window onkeydown={onKey} />
```
