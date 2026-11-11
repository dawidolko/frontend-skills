---
id: svelte/kit-shared-server-state
title: Server code of a SvelteKit app never keeps per-request data in module-level variables; the module is shared by every user.
severity: serious
check: static
applies:
  - project
stack:
  - sveltekit
skill: fe-sveltekit
since: 0.1.0
sources:
  - title: SvelteKit docs, State management (avoid shared state on the server, no side effects in load)
    url: https://svelte.dev/docs/kit/state-management
---

## Why

A server module is loaded once and lives for every request of every user. `let user` at the top of `+page.server.js` or `hooks.server.js`, set inside `load` or an action, is read by the next request: one person sees another person's name, cart or token. It works in development with one user and fails in production.

## Fix

Keep request data inside the function: read the user from `event.locals` (set it in `handle`), pass it through the return value of `load`, and persist anything that must outlive the request in a database or a cookie. A module-level constant (configuration, a client object) is fine; a cache must be keyed and must hold public data only.

## Examples

```js
// bad: src/routes/cart/+page.server.js
let cart = []
export const actions = { add: async ({ request }) => { cart.push((await request.formData()).get('id')) } }
// good
export const actions = {
  add: async ({ request, locals }) => { await db.cart.add(locals.user.id, (await request.formData()).get('id')) }
}
```
