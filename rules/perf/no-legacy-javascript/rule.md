---
id: perf/no-legacy-javascript
title: Do not ship polyfills and down-level transforms for features your target browsers already support; declare targets once.
severity: minor
check: browser
applies:
  - page
lighthouse:
  - legacy-javascript-insight
skill: fe-perf-delivery
since: 0.1.0
sources:
  - title: Chrome for Developers, Legacy JavaScript insight
    url: https://developer.chrome.com/docs/performance/insights/legacy-javascript
  - title: web.dev, Baseline
    url: https://web.dev/baseline
---

## Why

Transpiling classes, async functions and optional chaining for browsers nobody uses makes bundles larger and slower to run, and polyfills for Baseline features are downloaded by every visitor.

## Fix

Declare browser targets once (a `browserslist` query such as `baseline widely available`, or the bundler's `build.target`), drop blanket polyfill imports (`core-js/stable` in the entry), and add a polyfill only for a feature you use that is not in your targets. See `fe-tooling` for the configuration.

## Examples

```json
{ "browserslist": ["baseline widely available"] }
```
