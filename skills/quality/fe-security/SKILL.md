---
name: fe-security
description: Keeps front-end code from opening security holes in any stack - XSS sinks (innerHTML, dangerouslySetInnerHTML, v-html, {@html}) and sanitizing, no eval, postMessage origins, secrets kept out of public env variables, CSP and HTTP-only headers, SRI, window.open, HTTPS. Use when rendering user or CMS content, embedding third parties, adding env variables or headers, or when asked "is this safe".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Front-end security
  area: quality
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.js **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "security/raw-html-sink security/no-eval security/postmessage-origin security/no-secrets-in-client-env security/sri-cdn security/window-open-noopener security/csp-meta-ignored security/csp-strict security/https-only"
  version: 0.1.0
---

# Front-end security

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's sanitizer) wins over this skill.

## Rules

- Never pass user, CMS or API data to a raw HTML sink unsanitized; render text, or sanitize with DOMPurify (security/raw-html-sink).
- Never run strings as code: no `eval`, `new Function`, string timers (security/no-eval).
- `postMessage` names an exact origin; window message listeners check `event.origin` (security/postmessage-origin).
- Secrets never use a public env prefix (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`); they stay in server code (security/no-secrets-in-client-env).
- Versioned CDN files carry `integrity` and `crossorigin`, or are self-hosted (security/sri-cdn).
- `window.open` to other sites passes `noopener,noreferrer` (security/window-open-noopener).
- `frame-ancestors`, `X-Frame-Options`, HSTS and CSP reporting are HTTP headers, never meta tags (security/csp-meta-ignored).
- Production sends a strict CSP with nonces or hashes (security/csp-strict); everything loads over HTTPS (security/https-only).
- Validate URLs before binding them to `href` or `src`: allow `https:`, `http:`, `mailto:`, `tel:` only.
- Auth cookies are set by the server with `Secure`, `HttpOnly` and `SameSite`; never write tokens into the DOM or URLs.
- Never say code "is secure"; say what was checked and what a person must review.

## Do this

1. Search the change for sinks: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML`, `v-html`, `{@html}`, `set:html`, `bypassSecurityTrust`. For each, trace where the value comes from.
2. For rich text from a CMS or Markdown, sanitize once at a single helper (DOMPurify, configured once), and use only that helper.
3. For new environment variables, decide server or browser first; give browser ones the framework prefix only if they are meant to be public.
4. For a new third party: self-host or pin with SRI, load it `async`, list it in the CSP, and isolate untrusted HTML in a sandboxed `iframe`.
5. Set security headers in the host configuration (`_headers`, `vercel.json`, `next.config` `headers()`, middleware), and verify them on the deployed response.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds unsanitized HTML sinks, `eval`, unchecked `postMessage`, secret-looking public env variables, CDN files without SRI, `window.open` without `noopener` and headers placed in meta tags.
- `audit --url <page>` adds Lighthouse's HTTPS and CSP checks on the rendered page.
- Run the package manager's audit (`npm audit --audit-level=high`) in CI. A person reviews authentication, authorisation, data flows and server configuration.

## References

- [references/security.md](references/security.md): sink table per framework, DOMPurify use, strict CSP recipe, Trusted Types, header placement table, cookies, URL validation, supply chain. Read it when handling user content or setting headers.
