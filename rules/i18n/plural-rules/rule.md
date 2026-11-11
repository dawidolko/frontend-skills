---
id: i18n/plural-rules
title: "Plurals use the locale's plural rules (ICU plural or Intl.PluralRules), never count === 1 ? singular : plural."
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
  - title: MDN, Intl.PluralRules
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
  - title: Unicode CLDR, Language plural rules
    url: https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
---

## Why

English has two plural forms; Polish has four categories (one, few, many, other: 1 plik, 2 pliki, 5 plików, 1,5 pliku), Arabic six, Japanese one. A `=== 1` test produces wrong text in most languages, and even English needs "0 files", not "0 file".

## Fix

Put the plural in the message: `{count, plural, one {# file} other {# files}}` in ICU syntax (react-intl, FormatJS, vue-i18n with ICU, next-intl, Paraglide) and give translators every category their language needs. Without a library, select the form with `new Intl.PluralRules(locale).select(n)`.

## Examples

```js
// bad
`${n} ${n === 1 ? 'file' : 'files'}`
// good
t('files', { count: n }) // en: "{count, plural, one {# file} other {# files}}"
                         // pl: "{count, plural, one {# plik} few {# pliki} many {# plików} other {# pliku}}"
```
