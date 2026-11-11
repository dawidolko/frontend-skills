---
id: security/window-open-noopener
title: window.open for another site passes "noopener" (and "noreferrer" when needed) so the new page cannot control yours.
severity: minor
check: static
applies:
  - html
  - jsx
  - vue
  - svelte
  - astro
skill: fe-security
since: 0.1.0
sources:
  - title: MDN, Window open() (windowFeatures, noopener)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/open
  - title: MDN, rel="noopener"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener
---

## Why

A page opened with `window.open` keeps a reference to your window in `window.opener` and can navigate it, for example to a fake login page while the user looks at the new tab (tabnabbing). Links with `target="_blank"` imply `noopener` in current browsers, but `window.open` does not.

## Fix

Pass the features string: `window.open(url, '_blank', 'noopener,noreferrer')`. Keep the opener only for your own popups that must talk back (an OAuth popup), and then check `event.origin` on the messages (security/postmessage-origin).

## Examples

```js
// bad
window.open(partnerUrl, '_blank')
// good
window.open(partnerUrl, '_blank', 'noopener,noreferrer')
```
