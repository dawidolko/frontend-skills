---
id: tooling/console-clean
title: Pages log no errors and use no deprecated browser APIs, as seen in the console on load and in the main flows.
severity: minor
check: browser
applies:
  - page
lighthouse:
  - errors-in-console
  - deprecations
skill: fe-lighthouse
since: 0.1.0
sources:
  - title: Chrome for Developers, Browser errors were logged to the console (Lighthouse audit)
    url: https://developer.chrome.com/docs/lighthouse/best-practices/errors-in-console
  - title: Chrome for Developers, Uses deprecated APIs (Lighthouse audit)
    url: https://developer.chrome.com/docs/lighthouse/best-practices/deprecations
---

## Why

Console errors are failed requests, uncaught exceptions and broken features that someone has already hit. Deprecated APIs (for example `unload` handlers, synchronous XHR, `document.domain`) stop working in a later browser release, usually without notice to the site owner.

## Fix

Open the console on each changed page and fix every error at its cause (a missing file, a null reference, a CSP block), not by catching and hiding it. Replace each deprecated API the Issues panel lists. Errors from extensions do not count; errors from your third parties do.

## Examples

```js
// bad: hides the error and the broken feature
try { initMap() } catch {}
// good: fix the cause, report what remains
if (mapElement) initMap(mapElement)
```
