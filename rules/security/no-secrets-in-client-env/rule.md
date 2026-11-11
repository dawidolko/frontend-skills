---
id: security/no-secrets-in-client-env
title: Secrets never use a client-exposed environment prefix (NEXT_PUBLIC_, VITE_, PUBLIC_, NUXT_PUBLIC_); they stay on the server.
severity: critical
check: static
applies:
  - html
  - jsx
  - vue
  - svelte
  - astro
skill: fe-security
since: 0.1.0
sources:
  - title: Next.js, Environment variables (bundling for the browser)
    url: https://nextjs.org/docs/app/guides/environment-variables
  - title: Vite, Env variables and modes (security notes)
    url: https://vite.dev/guide/env-and-mode
  - title: Astro, Environment variables
    url: https://docs.astro.build/en/guides/environment-variables/
---

## Why

Build tools copy every variable with these prefixes into the JavaScript sent to the browser, where anyone can read it in DevTools. A payment secret, database password or private API key with such a prefix is public the moment the site is deployed, and stays in old bundles and caches after you rotate it.

## Fix

Rename the variable without the public prefix and use it only in server code (API routes, server actions, `+server.js`, server-only modules), then call that server code from the browser. Rotate any secret that was ever shipped. Keep only keys meant to be public (a publishable payment key, an analytics id) under the public prefix.

## Examples

```js
// bad: shipped to every visitor
fetch(url, { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}` } })
// good: server route reads STRIPE_SECRET_KEY; the browser calls /api/charges
fetch('/api/charges', { method: 'POST', body })
```
