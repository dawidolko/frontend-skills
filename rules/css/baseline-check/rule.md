---
id: css/baseline-check
title: Before using a newer CSS feature, check its Baseline status against the project's browser targets and plan the fallback.
severity: minor
check: manual
applies:
  - css
  - scss
  - less
skill: fe-css-modern
since: 0.1.0
sources:
  - title: web.dev, Baseline
    url: https://web.dev/baseline
  - title: W3C WebDX Community Group, web-features (the data behind Baseline)
    url: https://github.com/web-platform-dx/web-features
  - title: MDN, @supports
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
---

## Why

"Works in my browser" is not support. A feature that is Newly available works in the current version of every major browser but not in versions a part of the audience still uses; a feature that is not Baseline is missing in at least one engine. Using either for something essential hides content or breaks layout for those visitors.

## Fix

Look the feature up (web-features explorer, MDN's Baseline box, webstatus.dev) and compare it with the project's `browserslist` or support policy. Widely available: use it. Newly available: use it when the targets allow, or as enhancement that degrades harmlessly. Not Baseline: only inside `@supports` with a fallback. Write the status and the date in a comment when it decides the code.

## Examples

```css
/* bad: the layout depends on a feature some targets lack */
.panel { position-anchor: --trigger; top: anchor(bottom); }
/* good: Baseline status checked 2026-11-11 (not Baseline), fallback first */
.panel { top: 100%; }
@supports (anchor-name: --a) { .panel { position-anchor: --trigger; top: anchor(bottom); } }
```
