---
id: i18n/same-keys
title: Every locale file has the same keys and placeholders as the source locale, and the plural forms its language needs.
severity: serious
check: manual
applies:
  - project
skill: fe-i18n
since: 0.1.0
sources:
  - title: Unicode CLDR, Language plural rules
    url: https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
  - title: FormatJS, Message syntax (arguments and plural)
    url: https://formatjs.github.io/docs/core-concepts/icu-syntax/
---

## Why

A missing key shows the raw key or the fallback language to users; a renamed placeholder (`{count}` in English, `{liczba}` in Polish) crashes the formatter or prints the braces; a Polish message with only `one` and `other` gives wrong forms for 2–4 and 5+.

## Fix

Compare key sets and placeholder names of every locale with the source in CI (most i18n libraries have a lint or extract command; a short script that flattens the JSON is enough). For plurals, list the categories each language needs with `new Intl.PluralRules(locale).resolvedOptions().pluralCategories` and check every plural message has them.

## Examples

```js
const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]))
const missing = keys(en).filter((k) => !keys(pl).includes(k))
if (missing.length) { console.error('pl is missing', missing); process.exit(1) }
```
