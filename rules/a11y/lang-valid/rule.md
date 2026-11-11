---
id: a11y/lang-valid
title: Every lang value is a valid BCP 47 language tag ("en", "en-GB", "pl"), never "en_US" or a language name.
severity: serious
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 3.1.1
  - 3.1.2
level: AA
axe:
  - html-lang-valid
  - valid-lang
lighthouse:
  - html-lang-valid
  - valid-lang
skill: fe-a11y-core
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 3.1.1 Language of Page
    url: https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html
  - title: WCAG 2.2, Understanding SC 3.1.2 Language of Parts
    url: https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html
  - title: W3C Internationalization, Language tags in HTML and XML
    url: https://www.w3.org/International/articles/language-tags/
---

## Why

Screen readers pick the voice and pronunciation rules from `lang`. An invalid value is ignored, so Polish text may be read with English rules and become unintelligible. Locale codes from other systems (`en_US` with an underscore) are the usual cause.

## Fix

Use a BCP 47 tag: language, then optional script and region, joined by hyphens (`en`, `en-GB`, `pt-BR`, `zh-Hant`). When the value comes from the app's locale, convert underscores to hyphens once (`locale.replace('_', '-')`) or use `new Intl.Locale(locale).toString()`.

## Examples

```html
<!-- bad -->
<html lang="en_US"> … <p lang="polish">Dzień dobry</p>
<!-- good -->
<html lang="en-US"> … <p lang="pl">Dzień dobry</p>
```
