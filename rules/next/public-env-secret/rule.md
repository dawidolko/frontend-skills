---
id: next/public-env-secret
title: Never give a secret the NEXT_PUBLIC_ prefix; those values are copied into the JavaScript every visitor downloads.
severity: serious
check: static
applies:
  - jsx
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, Environment variables (bundling environment variables for the browser)
    url: https://nextjs.org/docs/app/guides/environment-variables
  - title: Next.js docs, Data Security
    url: https://nextjs.org/docs/app/guides/data-security
---

## Why

At `next build`, every `process.env.NEXT_PUBLIC_…` reference is replaced by its value in the client bundle. A name such as `NEXT_PUBLIC_STRIPE_SECRET_KEY` or `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE` therefore publishes the secret to anyone who opens the browser's developer tools, and it stays in old bundles and caches after you rotate it.

## Fix

Drop the prefix and read the value only on the server: in a Server Component, a Route Handler or a Server Action, in a module that starts with `import 'server-only'`. Rotate the key if a build with the public name was ever deployed. Keys that are public by design (a publishable or anon key, an analytics id) may keep the prefix.

## Examples

```tsx
// bad
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
// good: lib/stripe.ts
import 'server-only'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
```
