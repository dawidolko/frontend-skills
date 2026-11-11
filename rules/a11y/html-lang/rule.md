---
id: a11y/html-lang
title: The html element names the language of the page in a non-empty lang attribute.
severity: serious
check: static
applies:
  - html
  - astro
  - jsx
  - svelte
wcag:
  - 3.1.1
level: A
axe:
  - html-has-lang
  - html-lang-valid
skill: fe-html
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 3.1.1 Language of Page
    url: https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html
  - title: MDN, the lang global attribute
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang
  - title: W3Schools, HTML style guide (language)
    url: https://www.w3schools.com/html/html5_syntax.asp
---

## Why

Screen readers choose their pronunciation from `lang`; without it the text is read with the user's default voice and can be unintelligible. Browsers also use it for hyphenation, translation and font selection.

## Fix

Put a BCP 47 language tag on the root element: `<html lang="en">`, `<html lang="pl">`. In Next.js set it in the root layout, in Astro in the layout, in SvelteKit in `src/app.html`. Mark passages in another language with their own `lang`.

## Examples

```html
<!-- bad -->
<html>
<!-- good -->
<html lang="en">
```
