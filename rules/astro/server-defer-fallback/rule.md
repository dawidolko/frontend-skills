---
id: astro/server-defer-fallback
title: A server island (server:defer) has slot="fallback" content of the same size, and receives only small serializable props.
severity: moderate
check: static
applies:
  - astro
stack:
  - astro
skill: fe-astro
since: 0.1.0
sources:
  - title: Astro docs, Server islands (fallback content, passing props)
    url: https://docs.astro.build/en/guides/server-islands/
---

## Why

A component with `server:defer` is left out of the first HTML and fetched afterwards. Without fallback content its space is empty until the request returns, so the page jumps when it arrives. Its props travel in the request URL: functions cannot be passed, and above 2,048 bytes Astro switches to a POST request that browsers do not cache.

## Fix

Add a child with `slot="fallback"` (a skeleton or generic version of the same size). Pass ids and small values, not whole objects or arrays; let the island load its own data. Server islands need an adapter installed.

## Examples

```astro
<!-- bad -->
<Avatar server:defer user={user} />
<!-- good -->
<Avatar server:defer userId={user.id}>
  <img slot="fallback" src={genericAvatar.src} alt="" width="40" height="40" />
</Avatar>
```
