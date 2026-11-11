---
id: a11y/landmarks
title: Each page has one main landmark, all content sits inside landmarks, and repeated landmarks of a kind have distinct labels.
severity: moderate
check: browser
applies:
  - page
wcag:
  - 1.3.1
  - 2.4.1
level: A
axe:
  - landmark-one-main
  - region
  - landmark-unique
  - page-has-heading-one
skill: fe-a11y-core
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Landmark Regions
    url: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
  - title: WCAG 2.2 Technique ARIA11, using ARIA landmarks to identify regions of a page
    url: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA11
---

## Why

Screen reader users jump between landmarks ("main", "navigation", "search") to skip what they do not need. Content outside any landmark is easy to miss; two unnamed navigations sound identical. axe-core reports these as best practices that support 1.3.1 and 2.4.1.

## Fix

In the shared layout: `<header>`, `<nav aria-label="Main">`, one `<main id="main">`, `<footer>`; `<aside>` for related content; `<search>` around site search. Label repeated landmarks (`aria-label="Main"`, `aria-label="Footer"`). Start the main content with the page's `h1`.

## Examples

```html
<header>…<nav aria-label="Main">…</nav></header>
<main id="main"><h1>Orders</h1>…</main>
<footer><nav aria-label="Footer">…</nav></footer>
```
