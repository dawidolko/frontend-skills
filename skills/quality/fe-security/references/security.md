# Front-end security reference

Depth for the `fe-security` skill. Rule ids in brackets: `frontend-skills explain <id>`. Read on 2026-11-11 from OWASP Cheat Sheets, MDN, web.dev, the CSP Level 3 draft and the framework docs; `dompurify` 3.4.17 on the npm registry (licence `MPL-2.0 OR Apache-2.0`).

## XSS sinks per framework [security/raw-html-sink]

| Stack | Escaped by default | Raw HTML escape hatch | Notes |
| --- | --- | --- | --- |
| Plain JS | `textContent`, `createTextNode` | `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` | `setHTML()` (Sanitizer API) is not Baseline; enhancement only |
| React | `{value}` | `dangerouslySetInnerHTML` | `href={value}` can carry `javascript:`; validate URLs |
| Vue | `{{ value }}`, `v-text` | `v-html` | Never build `template` strings from user data |
| Svelte | `{value}` | `{@html value}` | – |
| Astro | `{value}`, `set:text` | `set:html` | – |
| Angular | Interpolation; `[innerHTML]` is sanitized | `bypassSecurityTrustHtml` and siblings | Treat every bypass as a review item |

```js
import DOMPurify from 'dompurify'
export const safeHtml = (html) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
```

Sanitize, then do not modify the result with string or regex edits; on the server DOMPurify needs a DOM (jsdom).

## URLs in attributes

```js
export function safeUrl(value) {
  try {
    const url = new URL(value, location.origin)
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol) ? url.href : '#'
  } catch { return '#' }
}
```

## Strict CSP [security/csp-strict]

```text
Content-Security-Policy:
  script-src 'nonce-{per-response random}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none'
```

- `'strict-dynamic'` makes modern browsers ignore `https:` and `'unsafe-inline'`, which remain only as fallbacks for old ones.
- A nonce must be new and unguessable for each response (128 bits or more); never hard-code it or cache HTML that carries one.
- Static sites without a server use hashes of inline scripts (`'sha256-…'`).
- Roll out with `Content-Security-Policy-Report-Only` (header only) and a reporting endpoint, then enforce.
- Trusted Types (`require-trusted-types-for 'script'`) blocks string-to-sink assignments entirely; a `default` policy is a migration aid only.

## Where headers work [security/csp-meta-ignored]

| Mechanism | In `<meta>` | Note |
| --- | --- | --- |
| `Content-Security-Policy` | Partly | `frame-ancestors`, `sandbox`, `report-uri` are ignored in meta |
| `Content-Security-Policy-Report-Only` | No | Header only |
| `X-Frame-Options` | No | Header only |
| `Strict-Transport-Security` | No | Header only |
| `Referrer-Policy` | Yes | `<meta name="referrer">` or per-element `referrerpolicy` |
| `Permissions-Policy` | No | Header, or the iframe `allow` attribute |
| `Set-Cookie` | No | Ignored |
| `X-Content-Type-Options`, COOP, COEP, CORP | No | Header only |

## Messages and windows [security/postmessage-origin, security/window-open-noopener]

- Send with the exact origin; receive only from an allowlist and validate `event.data` with a schema.
- `<a target="_blank">` implies `noopener` in current browsers; `window.open` does not.
- Embed untrusted HTML in `<iframe sandbox srcdoc="…">` with the fewest `allow-*` tokens; never `allow-scripts` together with `allow-same-origin` for untrusted content.

## Secrets and env [security/no-secrets-in-client-env]

| Stack | Public prefix (bundled into the browser) | Server only |
| --- | --- | --- |
| Next.js | `NEXT_PUBLIC_` | Everything else, read in server code |
| Vite | `VITE_` (configurable `envPrefix`) | Not exposed |
| Nuxt | `runtimeConfig.public` / `NUXT_PUBLIC_` | `runtimeConfig` |
| Astro | `PUBLIC_` | Others, or `astro:env` with `access: "secret"` |
| SvelteKit | See the env documentation of the installed version | Server modules |

Commit only `.env.example`; keep `.env*.local` in `.gitignore`. Rotate any secret that was ever bundled.

## Cookies and tokens

- Session cookies come from the server with `Secure; HttpOnly; SameSite=Lax` (or `Strict`); `SameSite=None` always with `Secure`.
- Long-lived tokens in `localStorage` are readable by any XSS; prefer `HttpOnly` cookies with CSRF protection. Where an SPA must hold a token, keep it short-lived and in memory.
- CORS is not authorisation: the server checks every request.

## Supply chain

Commit the lockfile, install with `npm ci` (or the frozen equivalent) in CI, run `npm audit --audit-level=high`, prefer few and maintained dependencies, and pin third-party CDN files with SRI [security/sri-cdn].

## Sources

- OWASP HTML5 Security (web messaging, tabnabbing): https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- OWASP XSS Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- OWASP DOM based XSS Prevention: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- OWASP Content Security Policy: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- web.dev, Strict CSP: https://web.dev/articles/strict-csp
- web.dev, Trusted Types: https://web.dev/articles/trusted-types
- CSP Level 3: https://www.w3.org/TR/CSP3/
- MDN, Subresource Integrity: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
- DOMPurify: https://github.com/cure53/DOMPurify
- Angular security: https://angular.dev/best-practices/security
