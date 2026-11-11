---
id: svelte/derived-not-effect
title: A value computed from state is a $derived, not a $state that an $effect keeps in sync.
severity: moderate
check: static
applies:
  - svelte
stack:
  - svelte
  - sveltekit
skill: fe-svelte
since: 0.1.0
sources:
  - title: Svelte docs, $effect (when not to use $effect)
    url: https://svelte.dev/docs/svelte/$effect
  - title: Svelte docs, Best practices ($derived and $effect)
    url: https://svelte.dev/docs/svelte/best-practices
---

## Why

An effect runs after the update, so the synced value is stale for one render, the component updates twice, and two pieces of state can drift apart. Effects that write state are the usual start of update loops (`effect_update_depth_exceeded`) and make the data flow hard to follow.

## Fix

Declare the value with `$derived(expression)`, or `$derived.by(() => { ... })` for several statements. Deriveds can be overridden by assignment (an optimistic value) and recompute when their inputs change. Keep `$effect` for work outside Svelte: a canvas, a third-party widget (better: `{@attach}`), analytics.

## Examples

```svelte
<!-- bad -->
<script>
  let { items } = $props()
  let visible = $state([])
  $effect(() => { visible = items.filter((item) => !item.hidden) })
</script>
<!-- good -->
<script>
  let { items } = $props()
  let visible = $derived(items.filter((item) => !item.hidden))
</script>
```
