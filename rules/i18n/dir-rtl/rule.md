---
id: i18n/dir-rtl
title: Pages in right-to-left languages (Arabic, Hebrew, Persian, Urdu) set dir="rtl" on html together with lang.
severity: serious
check: static
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
skill: fe-i18n
since: 0.1.0
sources:
  - title: W3C Internationalization, Structural markup and right-to-left text in HTML
    url: https://www.w3.org/International/questions/qa-html-dir
  - title: MDN, the dir global attribute
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir
---

## Why

Without `dir="rtl"`, text in these languages is laid out left to right: punctuation lands on the wrong side, mixed numbers and Latin words jump around, and the whole layout (navigation, form fields, scroll direction) reads backwards for the user.

## Fix

Set `dir` in markup, not in CSS: `<html lang="ar" dir="rtl">`, from the same locale data that sets `lang` (a list of right-to-left languages, or `Intl.Locale` text info where the runtime has it). Write layout with logical properties so it mirrors without extra CSS. Use `dir="auto"` on fields and elements that show user-generated text.

## Examples

```html
<!-- bad -->
<html lang="ar">
<!-- good -->
<html lang="ar" dir="rtl">
```
