---
id: svelte/no-legacy-syntax
title: New Svelte 5 code uses runes and the new syntax, not export let, $:, on:event, slot or svelte:component.
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
  - title: Svelte docs, Best practices (avoid legacy features)
    url: https://svelte.dev/docs/svelte/best-practices
  - title: Svelte docs, Svelte 5 migration guide
    url: https://svelte.dev/docs/svelte/v5-migration-guide
---

## Why

Svelte 5 still compiles the Svelte 4 syntax, but only in legacy mode: a component cannot mix it with runes, the compiler marks it deprecated, and new APIs (snippets, attachments, fine-grained reactivity in classes) do not work with it. Code that an agent copies from Svelte 4 examples spreads the old model through a Svelte 5 codebase.

## Fix

| Svelte 4 | Svelte 5 |
| --- | --- |
| `export let title` | `let { title } = $props()` |
| `$: total = a + b` | `let total = $derived(a + b)`; a side effect goes into an event handler, or `$effect` as a last resort |
| `on:click={save}`, `createEventDispatcher` | `onclick={save}`; callback props (`onsave`) |
| `<slot />`, `<slot name="x">` | `{@render children?.()}`, snippet props |
| `<svelte:component this={C} />` | `<C />` (a component in a variable is dynamic) |
| `$$props`, `$$restProps` | `let { a, ...rest } = $props()` |

`npx sv migrate svelte-5` converts most of this. A project still on Svelte 4 (the profile says so) is not checked.

## Examples

```svelte
<!-- bad -->
<script>
  export let count
  $: double = count * 2
</script>
<button on:click={() => count++}>{double}</button>
<!-- good -->
<script>
  let { count = $bindable() } = $props()
  let double = $derived(count * 2)
</script>
<button onclick={() => count++}>{double}</button>
```
