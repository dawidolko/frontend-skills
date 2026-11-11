---
id: a11y/form-errors
title: An input error is shown in text next to the field, tied to it with aria-describedby, and says how to fix it.
severity: serious
check: manual
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 3.3.1
  - 3.3.3
  - 4.1.3
level: AA
skill: fe-a11y-forms
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 3.3.1 Error Identification
    url: https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html
  - title: WCAG 2.2, Understanding SC 3.3.3 Error Suggestion
    url: https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html
  - title: WAI Forms Tutorial, user notifications
    url: https://www.w3.org/WAI/tutorials/forms/notifications/
---

## Why

An error shown only by a red border is invisible to screen reader users and to people who cannot tell the colour apart; an error far from its field, or one that says only "invalid", leaves everyone guessing.

## Fix

On a failed submit: set `aria-invalid="true"` on each wrong field, render the message in text right after it with an `id`, point to it with `aria-describedby`, and say what to do ("Enter a date like 31/12/2026"). Move focus to the first wrong field, or to an error summary at the top that links to each field. Keep the values the person typed.

## Examples

```html
<!-- good -->
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Enter an email address like name@example.com.</p>
```
