---
id: security/postmessage-origin
title: postMessage names an exact target origin, and every window message listener checks event.origin against an allowlist.
severity: serious
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
  - title: MDN, Window postMessage() (security concerns)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
  - title: HTML Standard, Cross-document messaging (security)
    url: https://html.spec.whatwg.org/multipage/web-messaging.html#authors
---

## Why

With `"*"`, a token or personal data goes to whatever page is in the target window, including one an attacker navigated there. A listener that does not check `event.origin` accepts commands from any site that can open or frame yours.

## Fix

Send with the exact origin (`'https://widget.example.com'`). In every `message` listener on `window`, return early unless `event.origin` is in an allowlist (and `event.source` is the expected frame), then validate `event.data` before using it. Never pass message data to an HTML sink or `eval`.

## Examples

```js
// bad
frame.contentWindow.postMessage({ token }, '*')
window.addEventListener('message', (e) => apply(e.data))
// good
frame.contentWindow.postMessage({ token }, 'https://widget.example.com')
window.addEventListener('message', (e) => { if (e.origin === 'https://widget.example.com') apply(e.data) })
```
