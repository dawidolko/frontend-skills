---
id: html/required-select-placeholder
title: A required single-choice select starts with an empty placeholder option (value=""), so the required check can fail.
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
  - title: HTML Standard, the select element (placeholder label option)
    url: https://html.spec.whatwg.org/multipage/form-elements.html#placeholder-label-option
  - title: MDN, the select element
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select
---

## Why

A single-choice select always has a selected option; when the first real option is selected by default, `required` is already satisfied and the form submits whatever was preselected. People who did not notice the field send "Poland" or "Small" without choosing it, and the data is quietly wrong.

## Fix

Make the first option a placeholder with an empty value: `<option value="">Choose a country</option>`. The HTML standard requires it on a required select with one visible row. Keep the label; the placeholder is not a label.

## Examples

```html
<!-- bad -->
<select id="country" name="country" required><option value="pl">Poland</option></select>
<!-- good -->
<select id="country" name="country" required><option value="">Choose a country</option><option value="pl">Poland</option></select>
```
