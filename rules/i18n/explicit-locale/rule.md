---
id: i18n/explicit-locale
title: Intl formatters and toLocale*String() receive the app's active locale instead of relying on the runtime default.
severity: minor
check: static
applies:
  - jsx
  - vue
  - svelte
  - astro
  - html
skill: fe-i18n
since: 0.1.0
sources:
  - title: MDN, Intl (locales argument)
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument
  - title: MDN, Date.prototype.toLocaleDateString()
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
---

## Why

Without a locale, formatting follows the browser or server default. A Polish page then shows English dates to a visitor with an English browser, and server rendering (often `en-US` in a container) produces text that differs from the client, which causes hydration mismatches.

## Fix

Pass the locale the app uses for its messages (from the router, the i18n library or `<html lang>`), and set `timeZone` explicitly when rendering dates on the server.

## Examples

```js
// bad
date.toLocaleDateString()
// good
date.toLocaleDateString(locale, { dateStyle: 'long', timeZone })
```
