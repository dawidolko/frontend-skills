---
id: tooling/ignore-with-reason
title: Every fs-ignore comment names the rule id it silences and says why; a bare fs-ignore silences every rule on the line.
severity: moderate
check: manual
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
  - css
  - scss
  - less
skill: fe-fix
since: 0.1.0
sources:
  - title: Frontend Skills, architecture (suppression)
    url: https://github.com/dawidolko/frontend-skills/blob/main/docs/architecture.md
  - title: ESLint, Disabling rules with inline comments (describe the reason)
    url: https://eslint.org/docs/latest/use/configure/rules#comment-descriptions
---

## Why

A suppression without an id hides every rule on that line, including problems added later. Without a reason, the next person cannot tell a deliberate exception from a shortcut, and nobody revisits it. The audit cannot report a bare `fs-ignore` itself, because the comment silences that finding too.

## Fix

Fix the code when you can. When a finding is a real exception, write the id and a reason in the same comment: `<!-- fs-ignore a11y/positive-tabindex: third-party widget sets it, tracked in #123 -->`. For a rule the team does not follow at all, put it in `audit.ignore` in the profile and record why with `learn --lesson`.

## Examples

```html
<!-- bad -->
<div tabindex="3"> <!-- fs-ignore -->
<!-- good -->
<!-- fs-ignore a11y/positive-tabindex: embedded vendor widget, cannot change, issue #123 -->
<div tabindex="3">
```
