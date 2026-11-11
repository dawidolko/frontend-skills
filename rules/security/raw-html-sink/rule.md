---
id: security/raw-html-sink
title: Never pass user or remote data to a raw HTML sink (innerHTML, dangerouslySetInnerHTML, v-html, {@html}) without sanitizing it.
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
  - title: OWASP Cheat Sheet Series, Cross Site Scripting Prevention
    url: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
  - title: React, dangerouslySetInnerHTML
    url: https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
  - title: Vue.js, Security (HTML injection)
    url: https://vuejs.org/guide/best-practices/security.html
  - title: MDN, Element innerHTML (security considerations)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
---

## Why

Frameworks escape text for you; these escape hatches switch that off. A comment, a profile field or a CMS value that contains `<img src=x onerror=…>` then runs script in your users' sessions: it can read data on the page, act as the user and steal tokens that script can reach.

## Fix

Render data as text (`{value}`, `{{ value }}`, `textContent`). When the content must be HTML (CMS rich text, Markdown output), sanitize it on the way in with DOMPurify (`DOMPurify.sanitize(html)`) and do not modify it afterwards; better, sanitize on the server too. In Angular keep `[innerHTML]` (it sanitizes) and treat every `bypassSecurityTrust*` call as a security review item.

## Examples

```jsx
// bad
<div dangerouslySetInnerHTML={{ __html: comment.body }} />
// good
<p>{comment.body}</p>
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.html) }} />
```
