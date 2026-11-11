---
id: a11y/toast-timing
title: Toasts with actions or information the user needs do not disappear on a timer; others stay long enough and pause on hover and focus.
severity: moderate
check: manual
applies:
  - page
wcag:
  - 2.2.1
  - 4.1.3
level: A
skill: fe-a11y-carousel-toast
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.2.1 Timing Adjustable
    url: https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
  - title: WAI-ARIA Authoring Practices, Alert pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
---

## Why

A toast that offers "Undo" for five seconds is gone before a screen reader user hears it and finds the button, and before a magnifier user scrolls to it. The APG has no toast pattern; the rules come from the alert pattern and WCAG 2.2.1 and 4.1.3.

## Fix

Announce toasts through one live region that is always present (`role="status"`, `role="alert"` for errors). Do not auto-dismiss toasts that have a button or carry information the user must act on; keep them until closed. For short confirmations, show them for at least several seconds, pause the timer on hover and focus, and keep a close button. Never move focus into a toast; offer a keyboard path to its action (for example the same action in the page, or a documented shortcut).

## Examples

```js
// good: an undo toast stays until closed or used
showToast({ text: 'Message deleted', action: { label: 'Undo', run: undo }, timeout: null })
```
