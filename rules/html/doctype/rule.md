---
id: html/doctype
title: Every HTML document starts with <!doctype html> so the browser renders it in standards mode.
severity: moderate
check: static
applies:
  - html
lighthouse:
  - doctype
skill: fe-html
since: 0.1.0
sources:
  - title: WHATWG HTML, the DOCTYPE
    url: https://html.spec.whatwg.org/multipage/syntax.html#the-doctype
  - title: MDN, Quirks mode and standards mode
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Quirks_mode_and_standards_mode
  - title: W3Schools, HTML style guide (document type)
    url: https://www.w3schools.com/html/html5_syntax.asp
---

## Why

Without a doctype, browsers switch to quirks mode, which emulates old rendering bugs: the box model, table sizing and line heights differ, so the layout breaks in ways CSS alone cannot explain.

## Fix

Make `<!doctype html>` the very first line of every HTML document (case does not matter). Partial templates and framework components do not need it.

## Examples

```html
<!-- bad -->
<html lang="en">
<!-- good -->
<!doctype html>
<html lang="en">
```
