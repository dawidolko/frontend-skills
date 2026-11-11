---
id: nuxt/public-runtime-config
title: Secrets live in the top level of runtimeConfig, never under runtimeConfig.public, which every page sends to the browser.
severity: serious
check: static
applies:
  - project
stack:
  - nuxt
skill: fe-nuxt
since: 0.1.0
sources:
  - title: Nuxt docs, Runtime Config (exposing values; public keys reach the client)
    url: https://nuxt.com/docs/4.x/guide/going-further/runtime-config
---

## Why

Everything under `runtimeConfig.public` is serialised into the payload of every page, readable in the page source by anyone. A secret, a password or a private key placed there is published, and rotating it after the fact is the only fix.

## Fix

Move the value to the top level of `runtimeConfig` (server-only) and read it in `server/` routes with `useRuntimeConfig(event)`. Call third-party APIs that need it from a server route, not from the browser. Keep in `public` only values meant to be public: the API base URL, a site key, a publishable key.

## Examples

```js
// bad
runtimeConfig: { public: { stripeSecretKey: '' } }
// good
runtimeConfig: { stripeSecretKey: '', public: { stripePublishableKey: '' } }
```
