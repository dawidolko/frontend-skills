---
id: webc/lit-unsafe-html
title: Lit's unsafeHTML, unsafeSVG and unsafeStatic only receive strings the developer wrote or sanitized, never data.
severity: serious
check: static
applies:
  - jsx
stack:
  - lit
skill: fe-web-components
since: 0.1.0
sources:
  - title: Lit, Built-in directives (unsafeHTML, unsafeSVG)
    url: https://lit.dev/docs/templates/directives/
  - title: Lit, Expressions (static expressions and unsafeStatic)
    url: https://lit.dev/docs/templates/expressions/
---

## Why

A Lit expression such as `${comment}` is always rendered as text. `unsafeHTML(comment)` parses it as markup instead: a comment, a product description or a URL parameter that contains `<img src=x onerror=…>` runs script in the page with the user's session.

## Fix

Render data with a normal expression (`${comment}`) and build structure with templates. When rich text must be shown, sanitize it first (`unsafeHTML(DOMPurify.sanitize(html))`, or the Sanitizer API's `setHTML()` where supported) and keep that in one helper. Use `unsafeStatic` only with constants, such as a tag name chosen from a fixed list.

## Examples

```js
// bad
render() { return html`<div class="comment">${unsafeHTML(this.comment.body)}</div>` }
// good
render() { return html`<div class="comment">${this.comment.body}</div>` }
```
