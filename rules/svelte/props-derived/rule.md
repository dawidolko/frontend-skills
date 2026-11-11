---
id: svelte/props-derived
title: A top-level value computed from props is a $derived; a plain let or const keeps only the first value.
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
  - title: Svelte docs, Best practices ($props)
    url: https://svelte.dev/docs/svelte/best-practices
  - title: Svelte docs, Compiler warnings (state_referenced_locally)
    url: https://svelte.dev/docs/svelte/compiler-warnings
---

## Why

The script of a Svelte 5 component runs once. `const label = size === 'small' ? 'S' : 'L'` reads the prop at creation and never again, so when the parent changes `size` the label stays wrong. The compiler warns about it (`state_referenced_locally`), but the warning is easy to miss in a long build log.

## Fix

Wrap the expression in `$derived(...)` (or `$derived.by` for a block). If you really want the first value only, say so: `let initial = $state(untrack(() => value))` or name it `initialValue`.

## Examples

```svelte
<!-- bad -->
<script>
  let { size, price, locale } = $props()
  const label = size === 'small' ? 'S' : 'L'
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })
</script>
<!-- good -->
<script>
  let { size, price, locale } = $props()
  const label = $derived(size === 'small' ? 'S' : 'L')
  const formatter = $derived(new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }))
</script>
```
