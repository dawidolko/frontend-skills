---
id: html/form-submit
title: Fields sit in a form that is handled on its submit event with a submit button, so Enter, autofill and native validation work.
severity: moderate
check: manual
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
  - title: MDN, HTMLFormElement submit event
    url: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
  - title: HTML Standard, implicit submission
    url: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission
  - title: web.dev, Learn Forms
    url: https://web.dev/learn/forms
---

## Why

Inputs scattered in a `div` with a click handler on a button lose what the browser gives a form for free: Enter submits (implicit submission), constraint validation runs, password managers and autofill recognise the fields, and assistive technology announces a form. The click handler also misses submissions made with the keyboard.

## Fix

Wrap the fields in `<form>` with `action` and `method` where a server handles it, put one `<button type="submit">` in it, and handle the `submit` event (`event.preventDefault()` only when you send it with JavaScript). Read values with `new FormData(form)`. Do not disable the submit button until the form is valid; show the errors instead. In frameworks: React `<form onSubmit>` or a `form action`, Vue `@submit.prevent`, SvelteKit form actions with `use:enhance`, Angular `(ngSubmit)`.

## Examples

```html
<!-- bad -->
<div><input id="q" name="q" type="search"><button onclick="search()">Search</button></div>
<!-- good -->
<form role="search" action="/search"><label for="q">Search</label><input id="q" name="q" type="search"><button type="submit">Search</button></form>
```
