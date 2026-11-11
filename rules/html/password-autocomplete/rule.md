---
id: html/password-autocomplete
title: Password fields say current-password (sign-in) or new-password (sign-up, change) in autocomplete, and never use autocomplete off.
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
  - title: HTML Standard, Autofill (autofill field names)
    url: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
  - title: web.dev, Sign-in form best practices
    url: https://web.dev/articles/sign-in-form-best-practices
  - title: WCAG 2.2, Understanding SC 3.3.8 Accessible Authentication (Minimum)
    url: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
---

## Why

Password managers decide from `autocomplete` whether to fill a saved password or offer a new strong one. Without the token they guess, often wrongly (filling the old password into "new password"); `autocomplete="off"` tries to stop them altogether. People who rely on a manager instead of memory then cannot sign in easily, which is what WCAG 3.3.8 is about.

## Fix

Use `autocomplete="current-password"` on sign-in and on the "current password" field of a change form, `autocomplete="new-password"` on sign-up and on the new password fields, and `autocomplete="username"` on the account field next to them. Allow paste.

## Examples

```html
<!-- bad -->
<input id="pw" name="password" type="password" autocomplete="off">
<!-- good -->
<input id="pw" name="password" type="password" autocomplete="current-password">
```
