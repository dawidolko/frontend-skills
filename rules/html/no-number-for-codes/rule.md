---
id: html/no-number-for-codes
title: Codes made of digits (postal codes, card numbers, one-time codes, PINs) use type text with inputmode numeric, not type number.
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
skill: fe-forms
since: 0.1.0
sources:
  - title: HTML Standard, Number state (type=number)
    url: https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number)
  - title: MDN, inputmode
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode
---

## Why

`type="number"` is for quantities. On a postal code or card number it removes leading zeros, accepts `e` and `-`, can change the value when the person scrolls over the focused field, and shows spinner buttons that make no sense. The HTML standard itself says the number state is not for such values.

## Fix

Use `type="text"` with `inputmode="numeric"` for the digit keyboard, the right `autocomplete` token (`postal-code`, `cc-number`, `one-time-code`) and, when the format is fixed, `pattern` with a visible hint. Keep `type="number"` for amounts, ages and counts.

## Examples

```html
<!-- bad -->
<input id="zip" name="zip" type="number">
<!-- good -->
<input id="zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code">
```
