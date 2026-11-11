---
id: a11y/autocomplete-valid
title: An autocomplete attribute holds only tokens the HTML standard defines (email, given-name, new-password…).
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
  - 1.3.5
level: AA
axe:
  - autocomplete-valid
skill: fe-a11y-forms
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.3.5 Identify Input Purpose
    url: https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html
  - title: WHATWG HTML, autofilling form controls (the autocomplete attribute)
    url: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute
---

## Why

Browsers and assistive technology fill and label fields from the `autocomplete` value. An invented value (`autocomplete="e-mail"`, `"nope"`) is ignored, so people with motor or memory impairments must type everything again, and the field's purpose is not exposed.

## Fix

Use a field name from the standard (`name`, `given-name`, `family-name`, `email`, `tel`, `street-address`, `postal-code`, `country-name`, `bday`, `username`, `current-password`, `new-password`, `one-time-code`, `cc-number`…), optionally preceded by `section-*`, `shipping` or `billing`, and for contact fields `home`, `work` or `mobile`. Use `off` only where autofill would be wrong, never to stop password managers.

## Examples

```html
<!-- bad -->
<input id="mail" type="email" autocomplete="e-mail">
<!-- good -->
<input id="mail" type="email" autocomplete="email">
<input id="ship-zip" autocomplete="shipping postal-code">
```
