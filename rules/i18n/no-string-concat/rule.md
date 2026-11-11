---
id: i18n/no-string-concat
title: User-facing sentences are one message with placeholders, never joined from translated fragments and values.
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
  - title: W3C Internationalization, Working with composite messages
    url: https://www.w3.org/International/articles/composite-messages/
  - title: FormatJS, Message syntax
    url: https://formatjs.github.io/docs/core-concepts/icu-syntax/
---

## Why

Word order, grammatical case and agreement differ between languages, so "You have" + 3 + "items" cannot be translated: a Polish translator needs the number in the middle and a different noun form for 3 and for 5. Fragments also lose context for the translator.

## Fix

Write the whole sentence as one message with named placeholders and let the library insert the values: `t('cart.items', { count })` with `"You have {count, plural, one {# item} other {# items}}"`. Pass components for links and emphasis through the library's rich text API instead of splitting the string.

## Examples

```js
// bad
t('cart.has') + ' ' + count + ' ' + t('cart.items')
// good
t('cart.items', { count }) // "You have {count, plural, one {# item} other {# items}}"
```
