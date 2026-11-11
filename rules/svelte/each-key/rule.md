---
id: svelte/each-key
title: An each block whose items hold state (inputs, bindings, components, transitions) is keyed by a unique id, never by the index.
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
  - title: Svelte docs, each (keyed each blocks)
    url: https://svelte.dev/docs/svelte/each
  - title: Svelte docs, Best practices (each blocks)
    url: https://svelte.dev/docs/svelte/best-practices
---

## Why

Without a key, Svelte updates an each block by position: when an item is removed or the list is sorted, the DOM nodes and component state of one row stay put and show the data of the next. Typed text, a checked box, an open panel or a running transition jumps to the wrong item. Using the index as the key has the same effect.

## Fix

Add the item's unique id in parentheses after the `as` part: `{#each todos as todo (todo.id)}`. If the data has no id, create one when the item is created (`crypto.randomUUID()`). A list of plain text that never holds state may stay unkeyed.

## Examples

```svelte
<!-- bad -->
{#each todos as todo, i (i)}
  <label><input type="checkbox" bind:checked={todo.done} /> {todo.title}</label>
{/each}
<!-- good -->
{#each todos as todo (todo.id)}
  <label><input type="checkbox" bind:checked={todo.done} /> {todo.title}</label>
{/each}
```
