---
id: perf/no-whole-library-import
title: Client code does not import all of lodash or moment; use lodash-es, per-method imports, Intl or the platform.
severity: moderate
check: static
applies:
  - jsx
  - vue
  - svelte
  - astro
skill: fe-perf-delivery
since: 0.1.0
sources:
  - title: web.dev, Reduce JavaScript payloads with tree shaking
    url: https://web.dev/articles/reduce-javascript-payloads-with-tree-shaking
  - title: Moment.js, project status
    url: https://momentjs.com/docs/#/-project-status/
  - title: MDN, Intl.DateTimeFormat
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
---

## Why

The `lodash` package is CommonJS, so bundlers cannot drop the functions you do not use: even `import { debounce } from 'lodash'` ships the whole library. Moment.js is in maintenance mode and brings its locale data. Both add tens of kilobytes that every visitor downloads and parses.

## Fix

Import from `lodash-es` (tree-shakable) or a single-method path (`lodash/debounce`), or replace the call with the platform (`structuredClone`, `Array.prototype.flat`, `Object.groupBy`). Replace Moment with `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`, or a small modular date library.

## Examples

```js
// bad
import { debounce } from 'lodash'
import moment from 'moment'
// good
import { debounce } from 'lodash-es'
const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' })
```
