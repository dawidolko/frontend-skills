---
id: a11y/skip-link
title: Pages with repeated header or navigation start with a "Skip to main content" link whose target exists and takes focus.
severity: moderate
check: browser
applies:
  - page
wcag:
  - 2.4.1
level: A
axe:
  - bypass
  - skip-link
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.4.1 Bypass Blocks
    url: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
  - title: WCAG 2.2 Technique G1, adding a link at the top of each page that goes to the main content
    url: https://www.w3.org/WAI/WCAG22/Techniques/general/G1
---

## Why

Without a way past the header, a keyboard user presses Tab through every navigation link on every page before reaching the content. Landmarks help screen reader users, but sighted keyboard users need the link.

## Fix

Make the first focusable element of the layout `<a href="#main" class="skip-link">Skip to main content</a>`, give `<main id="main" tabindex="-1">`, and show the link when it has focus (visually hidden until `:focus`). Put it in the shared layout, not per page.

## Examples

```html
<!-- bad: the first Tab stop is the logo, then 30 menu links -->
<header><a href="/">Logo</a><nav>…</nav></header>
<!-- good -->
<a class="skip-link" href="#main">Skip to main content</a>
<header>…</header>
<main id="main" tabindex="-1">…</main>
```
