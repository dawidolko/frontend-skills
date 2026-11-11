---
id: js/no-floating-promises
title: Every promise is awaited, returned or given a .catch(); an async call is never left floating.
severity: moderate
check: manual
applies:
  - jsx
  - vue
  - svelte
  - astro
skill: fe-javascript
since: 0.1.0
sources:
  - title: MDN, Using promises (error handling and chaining)
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
  - title: MDN, Promise (chained promises and error handling)
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
---

## Why

`save()` without `await` runs on its own: the code after it does not wait, a failure becomes an unhandled rejection that the user never sees, and the order of updates is left to chance. `items.forEach(async (item) => ...)` is the same mistake in a loop: `forEach` ignores the promises.

## Fix

`await` the call (or return it), or attach `.catch()` that shows or reports the error. Use `for...of` with `await` when order matters and `Promise.all` or `Promise.allSettled` when it does not. Mark a deliberate fire-and-forget with `void save()` and handle its errors inside. In a TypeScript project, turn on the typed lint rule `@typescript-eslint/no-floating-promises`; it finds these with type information that a text check cannot have.

## Examples

```js
// bad
button.addEventListener('click', () => { save(form); close() })
// good
button.addEventListener('click', async () => {
  try { await save(form); close() } catch (err) { showError(err) }
})
```
