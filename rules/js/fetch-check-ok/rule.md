---
id: js/fetch-check-ok
title: After fetch, check response.ok (or the status) before reading the body; fetch does not reject on 404 or 500.
severity: moderate
check: static
applies:
  - jsx
  - html
  - vue
  - svelte
  - astro
skill: fe-javascript
since: 0.1.0
sources:
  - title: MDN, Window.fetch() (the promise rejects only on network errors)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
  - title: MDN, Response.ok
    url: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
---

## Why

`fetch` resolves for every HTTP answer, including 401, 404 and 500. Code that goes straight to `res.json()` then parses an error page, throws a confusing `SyntaxError`, or renders the error body as if it were data, and the user sees an empty list instead of an error message.

## Fix

Check `res.ok` (or `res.status`) and throw an `Error` with the status when it is false; show an error state where the call is used. A shared helper (`getJson(url)`) that does this once is the simplest way to keep every call right; passing the response to such a helper counts as a check.

## Examples

```js
// bad
const users = await (await fetch('/api/users')).json()
// good
const res = await fetch('/api/users', { signal })
if (!res.ok) throw new Error(`GET /api/users failed: ${res.status}`)
const users = await res.json()
```
