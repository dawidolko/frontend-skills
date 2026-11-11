---
id: svelte/kit-load-waterfall
title: A load function starts independent requests together and awaits parent() only after them, so data does not load in a chain.
severity: moderate
check: manual
applies:
  - svelte
stack:
  - sveltekit
skill: fe-sveltekit
since: 0.1.0
sources:
  - title: SvelteKit docs, Loading data (using parent data, streaming with promises)
    url: https://svelte.dev/docs/kit/load
  - title: SvelteKit docs, Performance (preventing waterfalls)
    url: https://svelte.dev/docs/kit/performance
---

## Why

`await parent()` waits for every layout above; a `fetch` written after it starts only then, and a second `await fetch` after the first waits again. Each step adds a full round trip, so the page renders after the sum of all requests instead of the slowest one.

## Fix

Start requests that do not need parent data first (or together with `Promise.all`) and call `await parent()` after them. Move chains that depend on each other into a server `load`, close to the database. Return slow, non-essential data as an un-awaited promise and render it with `{#await}` so the page streams.

## Examples

```js
// bad: +page.js
export async function load({ fetch, parent }) {
  const { user } = await parent()
  const posts = await (await fetch('/api/posts')).json()
  return { user, posts }
}
// good
export async function load({ fetch, parent }) {
  const postsRes = fetch('/api/posts')
  const { user } = await parent()
  return { user, posts: await (await postsRes).json() }
}
```
