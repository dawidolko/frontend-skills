---
id: astro/public-env-secret
title: Never give a secret the PUBLIC_ prefix; in Astro those variables are built into client code. Declare secrets in astro:env as server secrets.
severity: serious
check: static
applies:
  - astro
  - jsx
  - vue
  - svelte
stack:
  - astro
skill: fe-astro
since: 0.1.0
sources:
  - title: Astro docs, Using environment variables (PUBLIC_ prefix and astro:env)
    url: https://docs.astro.build/en/guides/environment-variables/
---

## Why

Astro exposes only `PUBLIC_` variables to client-side code, and it does so by writing their values into the bundle. A name such as `PUBLIC_STRIPE_SECRET_KEY` publishes the key to every visitor, in every island and script that reads it, and in every cached copy of that bundle.

## Fix

Rename it without the prefix and read it only in server code (front matter of an on-demand page, an endpoint, an action). Better, declare it in the `env.schema` of `astro.config` as `envField.string({ context: 'server', access: 'secret' })` and import it from `astro:env/server`; Astro then refuses to put it in a client bundle. Rotate a key that was ever deployed under a public name.

## Examples

```astro
---
// bad
const stripe = new Stripe(import.meta.env.PUBLIC_STRIPE_SECRET_KEY)
// good
import { STRIPE_SECRET_KEY } from 'astro:env/server'
const stripe = new Stripe(STRIPE_SECRET_KEY)
---
```
