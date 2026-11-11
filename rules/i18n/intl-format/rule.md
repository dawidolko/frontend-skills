---
id: i18n/intl-format
title: Dates, times, numbers and prices are formatted with Intl for the user's locale, never assembled from parts.
severity: moderate
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
  - title: MDN, Intl.DateTimeFormat
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  - title: MDN, Intl.NumberFormat
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
---

## Why

Date order, separators, month names, decimal marks, grouping and the place of the currency sign differ by locale: 11/12/2026 is November in the US and December in Poland, and "1,234.50 zł" is wrong in Polish ("1234,50 zł"). Hand-built strings are right for one locale at most.

## Fix

Create formatters once per locale and reuse them: `new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })`, `new Intl.NumberFormat(locale, { style: 'currency', currency })`, `Intl.RelativeTimeFormat` for "3 days ago", `Intl.ListFormat` for "A, B and C". Keep machine formats (ISO 8601 in `datetime`, APIs) separate from display.

## Examples

```js
// bad
d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
total.toFixed(2) + ' zł'
// good
new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(d)
new Intl.NumberFormat(locale, { style: 'currency', currency: 'PLN' }).format(total)
```
