# Front-end security: sources and candidate rules

Read on 2026-11-11. Primary sources:

- OWASP Top 10:2025 (presented as the 2025 release, not a candidate): https://top10.owasp.org/2025 (owasp.org/Top10/2025 redirects there)
- OWASP Cheat Sheets: XSS Prevention https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html ; DOM-based XSS Prevention https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html ; Content Security Policy https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- W3C Content Security Policy Level 3 (Working Draft, 2026-10-27): https://www.w3.org/TR/CSP3/ (§3.2, §3.3 on meta delivery)
- web.dev, Mitigate XSS with a strict CSP: https://web.dev/articles/strict-csp
- MDN: Trusted Types API https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API ; `Element.setHTML` https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML ; Subresource Integrity https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity ; `rel=noopener` https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener ; `Set-Cookie` https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie ; CORS https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS ; `frame-ancestors` https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors ; `X-Frame-Options` https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options ; `postMessage` https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage ; `<meta http-equiv>` https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv ; `Referrer-Policy` https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy
- Chromium SameSite updates: https://www.chromium.org/updates/same-site/
- RFC 6797 (HSTS) §8.5: https://www.rfc-editor.org/rfc/rfc6797#section-8.5
- Permissions Policy (Editor's Draft 2026-11-08): https://w3c.github.io/webappsec-permissions-policy/
- Framework docs: React `dangerouslySetInnerHTML` https://react.dev/reference/react-dom/components/common ; Vue security https://vuejs.org/guide/best-practices/security ; Svelte `{@html}` https://svelte.dev/docs/svelte/@html ; Astro `set:html` https://docs.astro.build/en/reference/directives-reference/ ; Angular security https://angular.dev/best-practices/security
- Env vars: Next.js https://nextjs.org/docs/app/guides/environment-variables (lastUpdated 2026-08-25) ; Vite https://vite.dev/guide/env-and-mode ; Astro https://docs.astro.build/en/guides/environment-variables/ ; Nuxt 4 runtime config https://nuxt.com/docs/4.x/guide/going-further/runtime-config ; SvelteKit https://svelte.dev/docs/kit/environment-variables
- DOMPurify: https://github.com/cure53/DOMPurify ; npm registry `dompurify/latest`; bundlephobia API
- npm audit: https://docs.npmjs.com/cli/v11/commands/npm-audit
- Supply-chain advisories: CISA alert 2025-09-23 https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem ; GitHub Blog 2025-09-22 https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/ ; GHSA-4x49-vf9v-38px (debug 4.4.2) https://github.com/debug-js/debug/security/advisories/GHSA-4x49-vf9v-38px
- Baseline: `web-features` 3.45.0 data.json (https://www.npmjs.com/package/web-features)

OWASP Top 10:2025 categories: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain
Failures, A04 Cryptographic Failures, A05 Injection (XSS lives here), A06 Insecure Design, A07 Authentication Failures,
A08 Software or Data Integrity Failures (SRI fits here), A09 Security Logging and Alerting Failures, A10 Mishandling of
Exceptional Conditions. No release date is printed on the index page (copyright 2021-2025).

Baseline (web-features 3.45.0): CSP widely (since 2019-02-02); Subresource integrity widely (2020-10-30); Trusted Types
**newly available 2026-02-24** (not yet widely); `X-Frame-Options` widely; Referrer policy widely (2024-03-20);
`postMessage` widely; sandboxed iframes widely; Sanitizer API (`setHTML`) **not Baseline**; `setHTMLUnsafe`/
`parseHTMLUnsafe` newly available 2025-09-15; Cookie Store API not Baseline; partitioned cookies not Baseline.

## XSS: output encoding and framework escape hatches

Severity in column `sev`.

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| security/no-raw-html-unsanitized | Never pass untrusted or user-derived strings to a raw-HTML escape hatch; sanitize first or render as text. | These bypass the framework's automatic escaping and are the main XSS entry points. | OWASP XSS Prevention, "Framework security"; React, Vue, Svelte, Astro, Angular docs | React `dangerouslySetInnerHTML`, Vue `v-html`, Svelte `{@html}`, Astro `set:html`, Angular `[innerHTML]` + `bypassSecurityTrust*`, Lit `unsafeHTML`, plain `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write` | static: find each sink; flag when the value is not a literal and not wrapped in a known sanitizer call | `v-html="comment.body"` → `{{ comment.body }}` or `v-html="sanitize(comment.body)"` | DOMPurify (below) | error |
| security/prefer-text-sinks | Insert dynamic text with `textContent`, `createTextNode`, framework interpolation, or `set:text`; not `innerHTML` or `innerText`. | Text sinks cannot execute markup; `innerText` on `<script>` can still execute code. | OWASP DOM XSS, Rule 6 and "Usually safe methods" | plain JS | static: `.innerHTML =` with non-literal RHS | `el.innerHTML = name` → `el.textContent = name` | – | error |
| security/no-bypass-security-trust | Treat any Angular `bypassSecurityTrust{Html,Style,Script,Url,ResourceUrl}` call as a review item; only use on values you built or verified yourself, close to their source. | Disables Angular's sanitizer for that value. | Angular security guide | Angular | static: call sites; error when argument derives from input/route/HTTP | `bypassSecurityTrustHtml(apiHtml)` → sanitize server-side or render text | – | error |
| security/no-untrusted-templates | Never build a component template (Vue `template:` string, Angular template, server-generated Angular template) from user content. | Template code runs as JavaScript; Vue calls this rule no. 1. | Vue security "Rule No.1"; Angular security "templates" | Vue, Angular | static: template string concatenation with variables | `template: '<div>'+x+'</div>'` → fixed template, data bound | – | error |
| security/no-mount-on-user-html | Do not mount Vue (or hydrate) on server HTML that also contains user content not produced by the framework. | Harmless HTML can be dangerous as a template. | Vue security, "Mounting on server-rendered pages" | Vue | manual | – | – | warning |
| security/safe-url-binding | Validate user-supplied URLs before binding to `href`/`src`/`action`/`formaction`: allow `https:`/`http:`/`mailto:` (allowlist), reject `javascript:` and `data:` for navigations. | Framework escaping does not stop `javascript:` URLs; OWASP says framework URL protection is not enough. | Vue security "URL injection"; OWASP XSS Prevention | any | static: `:href`/`href={…}` bound to non-literal without a URL-check helper | `<a :href="user.site">` → `<a :href="safeUrl(user.site)">` | `@braintree/sanitize-url` named by Vue docs (not measured) | warning |
| security/no-string-eval | No `eval`, `new Function`, or string arguments to `setTimeout`/`setInterval`. | Code-execution sinks; also forces `'unsafe-eval'` in CSP. | OWASP DOM XSS, Guidelines 5, 9, 10; web.dev strict CSP | JS | static: ESLint `no-eval`, `no-implied-eval`, `no-new-func` | `setTimeout("go()",10)` → `setTimeout(go,10)`; `eval(json)` → `JSON.parse(json)` | – | error |
| security/no-inline-handlers-js-urls | Do not use inline event-handler attributes in HTML strings or `href="javascript:…"`; attach listeners in code. | Blocks strict CSP and are XSS sinks. | web.dev strict CSP, "refactor"; OWASP XSS (attributes) | plain HTML / templates | static: `on\w+=` attributes in `.html` and template strings; `javascript:` hrefs | `<button onclick="buy()">` → `addEventListener('click', buy)` | – | warning |
| security/css-injection | Do not interpolate user data into `<style>` blocks or selectors; bind only allowed properties via style objects/`setProperty`. | CSS injection enables clickjacking overlays and data exfiltration. | Vue security "Style injection"; OWASP XSS Prevention (CSS) | any | static: template interpolation inside `<style>` or `style="…{{ }}"` strings | `:style="userCss"` → `:style="{ color: userColor }"` | – | warning |
| security/json-in-script | When embedding JSON in a `<script>` block in SSR output, escape `<` (e.g. `<`) rather than raw `JSON.stringify`. | `JSON.stringify` is not an output encoder; `</script>` in data closes the tag. | OWASP DOM XSS, Guideline 10 | SSR templates | static: `<script>window.__X = ${JSON.stringify(` | raw stringify → serialise with `<` escaped (frameworks' own serialisers do this) | – | error |
| security/sanitize-then-dont-touch | Do not modify HTML after sanitizing it (no regex/string edits, no re-parsing libraries afterwards). | Post-processing can undo sanitization (mutation XSS). | DOMPurify README; OWASP XSS Prevention, "HTML sanitization" | any | manual | `sanitize(x).replace(…)` → transform, then sanitize last | – | warning |

DOMPurify: `dompurify@3.4.17`, licence `(MPL-2.0 OR Apache-2.0)` (npm registry field; README says dual Apache-2.0 / MPL-2.0),
29,221 B min / 11,494 B min+gz (bundlephobia API), bundlephobia dependency count 0 (registry lists `@types/trusted-types`
as a dependency, types only). Why: maintained, browser-native DOM based, supports `RETURN_TRUSTED_TYPE` for Trusted Types.
On a server it needs a DOM (jsdom, latest version; README says happy-dom is not considered safe). Licence note: not MIT;
both offered licences are permissive/weak-copyleft and widely accepted, but flag for projects with strict licence policies.

The native Sanitizer API (`Element.setHTML`) is not Baseline (MDN "Limited availability"), so it is a progressive
enhancement only, not a replacement for DOMPurify today.

## Trusted Types and Content Security Policy

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| security/csp-present | Production HTML responses send a `Content-Security-Policy` header. | Defence in depth against XSS; OWASP stresses it is a second layer, not the fix. | OWASP CSP cheat sheet; CSP3 | any (server/host config: `vercel.json`, `netlify.toml`, `_headers`, Next `headers()`/middleware, nginx) | static: host config/middleware for CSP; runtime: response headers; Lighthouse best-practices `csp-xss` (weight 0, informative) | none → strict CSP header | – | warning |
| security/csp-strict | Use a nonce- or hash-based policy with `'strict-dynamic'`, plus `object-src 'none'` and `base-uri 'none'`, instead of host allowlists. | Allowlist policies are bypassable in most configurations. | web.dev strict CSP; OWASP CSP cheat sheet; CSP3 `strict-dynamic` | any | static: parse policy; flag `script-src` with hosts but no nonce/hash, `'unsafe-inline'` without nonce/hash, missing `object-src`/`base-uri` | `script-src 'self' cdn.example.com` → `script-src 'nonce-R4nd0m' 'strict-dynamic'; object-src 'none'; base-uri 'none'` | – | warning |
| security/csp-nonce-fresh | Generate a new unguessable nonce (≥128 bits, base64) per response; never hard-code it or cache HTML carrying it at a CDN. | A reused nonce lets injected scripts pass. | web.dev strict CSP "nonce"; Angular security (do not cache nonces at CDN) | SSR | static: literal `nonce-` value in config/source | `nonce-abc123` constant → `crypto.randomBytes(16).toString('base64')` per request | – | error |
| security/csp-hash-for-static | For static/SSG/SPA pages without a server, use hashes of inline scripts (frameworks can generate them, e.g. Angular `security.autoCsp`). | Nonces need per-response generation. | web.dev strict CSP "hash"; Angular security | static hosting | manual | – | – | info |
| security/csp-no-unsafe-eval | Avoid `'unsafe-eval'`. | Re-opens `eval` sinks. | web.dev strict CSP | any | static: policy string | – | – | warning |
| security/csp-report-only-first | Roll out new or tightened policies with `Content-Security-Policy-Report-Only` (header only) and a reporting endpoint (`report-to` + `Reporting-Endpoints`, plus deprecated `report-uri` for older browsers) before enforcing. | Finds breakage without blocking users. | web.dev strict CSP rollout; OWASP CSP cheat sheet "reporting" | any | static: report-only in `<meta>` (not allowed) | `<meta http-equiv="Content-Security-Policy-Report-Only">` → header | – | info |
| security/csp-meta-limits | If CSP must be delivered by `<meta http-equiv>`, place it early in `<head>` and know that `frame-ancestors`, `sandbox`, `report-uri` and report-only are ignored there. | CSP3 §3.3 excludes these from meta; web.dev advises meta only for local development. | CSP3 §3.2–3.3; MDN `frame-ancestors`; web.dev strict CSP | plain HTML / static hosts | static: meta CSP containing `frame-ancestors`/`sandbox`/`report-uri` | meta `frame-ancestors 'none'` → header | – | error |
| security/trusted-types | Where feasible, enforce Trusted Types with `require-trusted-types-for 'script'` and an allowlist `trusted-types <names>`; create HTML only through a named policy that sanitizes (e.g. DOMPurify). | Turns string-to-sink assignments into errors; Baseline newly available since 2026-02-24, so keep a tinyfill fallback for older browsers. | MDN Trusted Types; OWASP XSS Prevention (defence in depth); Angular (named policies `angular`, `angular#unsafe-bypass` …) | any | runtime: CSP header contains the directives; static: `trustedTypes.createPolicy` names vs header list | `el.innerHTML = s` → `el.innerHTML = policy.createHTML(s)` | DOMPurify `RETURN_TRUSTED_TYPE` | info |
| security/tt-default-policy-temporary | A `default` Trusted Types policy is a migration aid only, not the final state. | It silently accepts strings at every sink. | MDN Trusted Types "default policy" | any | static: `createPolicy('default'` | – | – | info |

## Third-party code, links, frames, messages

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| security/sri-third-party | Cross-origin `<script>` and `<link rel=stylesheet|preload|modulepreload>` with a fixed version carry `integrity="sha384-…"` and `crossorigin="anonymous"`. | Browser refuses a tampered file; without `crossorigin` the SRI request always fails. | MDN SRI; OWASP A08:2025 | plain HTML / layouts | static: `<script src="https://other-origin…">` without `integrity`; `integrity` without `crossorigin` | `<script src=cdn/lib@1.2.3.js>` → add `integrity` + `crossorigin="anonymous"` | – | warning (info for evergreen URLs that change content, where SRI cannot apply; prefer self-hosting) |
| security/noopener-window-open | `window.open` for untrusted URLs passes `"noopener"` (and `noreferrer` if needed); explicit `rel="noopener"` on `target=_blank` links is optional today. | Browsers now apply `noopener` behaviour to `target="_blank"` on `<a>`, `<area>`, `<form>`; `window.open` has no implicit default. | MDN `rel=noopener` | JS | static: `window.open(url, '_blank')` without features containing `noopener` | `window.open(u,'_blank')` → `window.open(u,'_blank','noopener')` | – | warning (link rule: info) |
| security/clickjacking | Pages with sensitive actions send `Content-Security-Policy: frame-ancestors 'none'` (or `'self'`) as a header, with `X-Frame-Options: DENY`/`SAMEORIGIN` for older browsers. | Prevents framing for clickjacking; neither works in `<meta>`; `ALLOW-FROM` is obsolete; `frame-ancestors` does not fall back to `default-src`. | MDN `frame-ancestors`, `X-Frame-Options`; CSP3 §3.3 | host/server config | static: host config; flag `<meta http-equiv="X-Frame-Options">` | meta XFO → header `frame-ancestors 'none'` | – | warning |
| security/postmessage-target-origin | Send with an exact `targetOrigin`, never `'*'` for non-public data. | A navigated window could receive the data. | MDN `postMessage` "security concerns" | JS | static: `.postMessage(…, '*')` | `postMessage(token,'*')` → `postMessage(token,'https://app.example')` | – | error |
| security/postmessage-origin-check | Every `message` listener checks `event.origin` against an exact allowlist (and `event.source` if known) and validates `event.data` shape. | Missing checks enable XSS from any window. | MDN `postMessage` | JS | static: `addEventListener('message'` handler not reading `.origin`; `origin.includes(`/`indexOf(` substring checks | `if (e.origin.includes('example.com'))` → `if (e.origin !== 'https://app.example.com') return` | – | error |
| security/iframe-sandbox | Embed untrusted or user HTML in a sandboxed iframe (`sandbox` with the minimum tokens; never `allow-scripts` together with `allow-same-origin` for same-origin content). | Vue notes user HTML is only safe sandboxed; sandbox is Baseline. | Vue security; web-features `iframe-sandbox` | any | static: `<iframe srcdoc=…>` without `sandbox` | – | – | warning |

## Cookies, CORS, secrets

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| security/session-cookie-flags | Session/auth cookies are set by the server with `Secure`, `HttpOnly`, explicit `SameSite` (`Lax` or `Strict`), ideally `__Host-` prefix (`Secure`, `Path=/`, no `Domain`). | `HttpOnly` keeps scripts from reading them; `SameSite` limits cross-site sending; Chrome defaults missing `SameSite` to Lax since Chrome 80, but other browsers' defaults differ, so set it. | MDN `Set-Cookie`; Chromium SameSite | server / SSR route handlers / middleware | static: `cookies().set(`/`setCookie(`/`res.cookie(` without `httpOnly`/`secure`/`sameSite`; `document.cookie` writes of tokens | `res.cookie('sid',v)` → `res.cookie('__Host-sid',v,{httpOnly:true,secure:true,sameSite:'lax',path:'/'})` | – | error |
| security/samesite-none-secure | `SameSite=None` always comes with `Secure`. | Rejected otherwise. | MDN `Set-Cookie`; Chromium SameSite | server | static | – | – | error |
| security/no-tokens-in-web-storage | Do not keep long-lived auth tokens in `localStorage`/`sessionStorage`/readable cookies; prefer `HttpOnly` cookies. | Any XSS can read script-accessible storage (OWASP: cookie attributes limit what scripts read). | OWASP XSS Prevention "defence in depth"; MDN `Set-Cookie` HttpOnly | SPA | static: `localStorage.setItem('token'|'jwt'|'access_token'` | – | – | warning (debated; see notes) |
| security/cors-not-auth | Do not treat CORS as server protection: servers still need authz and CSRF defences; with credentials the server must echo an exact origin, never `*`. | CORS only controls whether the browser lets a script read the response; simple requests still reach the server. | MDN CORS | API routes in full-stack frameworks | static: `Access-Control-Allow-Origin: *` together with `Allow-Credentials: true`; origin reflected without allowlist | reflect any `Origin` → allowlist | – | error |
| security/no-secrets-in-client-env | Never put secrets in client-exposed env variables (`NEXT_PUBLIC_*`, `VITE_*`, Astro `PUBLIC_*`, Nuxt `runtimeConfig.public`/`NUXT_PUBLIC_*`, SvelteKit public env, CRA-style prefixes); they are inlined into the bundle at build time. | Anyone can read the shipped JS. | Next.js env docs; Vite env docs; Astro env docs; Nuxt runtime config; SvelteKit env docs | Next, Vite (React/Vue/Svelte), Astro, Nuxt, SvelteKit | static: public-prefixed names matching `SECRET|PRIVATE|TOKEN|PASSWORD|KEY` (except known public keys, e.g. publishable keys); scan `dist/`/`.next/static` for high-entropy strings | `NEXT_PUBLIC_STRIPE_SECRET` → server-only `STRIPE_SECRET` | – | error |
| security/env-files-ignored | `.env*.local` (and secret `.env` files) are git-ignored; commit only example files. | Next and Vite docs both advise ignoring local env files. | Next.js env docs; Vite env docs | any | static: `.gitignore` lacks `*.local` / `.env*.local`; tracked `.env` with values | – | – | warning |
| security/server-only-imports | Server-only modules (DB clients, secret config) are not imported from client components. | Bundlers ship whatever client code imports. | Astro (`astro:env/server`, secret access), SvelteKit (`$app/env/private` cannot be imported in browser code), Next (non-`NEXT_PUBLIC_` vars are server-only) | Next, Astro, SvelteKit, Nuxt | static: `'use client'` file importing server modules; framework errors cover some cases | – | – | warning |

## Dependencies and supply chain

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| security/lockfile-committed | Commit the lockfile and install with the lockfile-respecting command in CI (`npm ci`, `pnpm install --frozen-lockfile`, `yarn install --immutable`). | Reproducible installs; `npm audit` needs a lockfile by default; CISA used lockfiles to find affected versions. | npm audit docs; CISA alert 2025-09-23 | any | static: missing `package-lock.json`/`pnpm-lock.yaml`/`yarn.lock`; CI using `npm install` | – | – | error |
| security/npm-audit-ci | Run `npm audit --audit-level=high` (or the package manager's equivalent) in CI, scoped with `--omit=dev` for shipped code; avoid `npm audit fix --force` without review. | Known-vulnerable versions; `--force` installs semver-major changes. | npm audit docs | any | runtime (CI) | – | – | warning |
| security/npm-audit-signatures | Run `npm audit signatures` to verify registry signatures and provenance attestations. | Detects tampered packages. | npm audit docs | any | runtime (CI) | – | – | info |
| security/rebuild-after-compromise | After a malicious-version advisory, upgrade, delete `node_modules`, clear the package-manager cache, and rebuild every browser bundle. | Bundles keep the malicious code after the lockfile is fixed (debug 4.4.2 targeted browsers, redirecting crypto transactions). | GHSA-4x49-vf9v-38px | any | manual | – | – | info |
| security/minimise-deps | Prefer built-in platform APIs and few, maintained dependencies. | Each dependency adds supply-chain surface (OWASP A03:2025). | OWASP Top 10:2025 A03 | any | static: count of direct deps; duplicates | – | – | info |

2025 npm incidents confirmed on official pages:
- 2025-09-08: maintainer account phished; `debug@4.4.2` published with browser-only crypto-redirect malware; fixed 4.4.3;
  advisory GHSA-4x49-vf9v-38px (CVE-2025-59144), published 2025-09-15. `chalk@5.6.1` was part of the same incident
  (advisory id GHSA-2v46-p5h4-248w seen only in search results, not opened).
- 2025-09 "Shai-Hulud" self-replicating worm: GitHub notified 2025-09-14, more than 500 packages removed (GitHub Blog
  2025-09-22); CISA alert 2025-09-23 advises reviewing lockfiles, pinning to releases before 2025-09-16, rotating
  credentials, phishing-resistant MFA. GitHub's response plan: trusted publishing, FIDO 2FA instead of TOTP, short-lived
  granular tokens, deprecating classic tokens.

## Security headers: meta vs HTTP only (be exact)

| mechanism | in `<meta>`? | notes / source |
|---|---|---|
| `Content-Security-Policy` | yes, partly | `frame-ancestors`, `sandbox`, `report-uri` are not supported in meta (CSP3 §3.3); web.dev recommends meta only for local development |
| `Content-Security-Policy-Report-Only` | no | CSP3 §3.2/§3.3 |
| `frame-ancestors` | no | MDN `frame-ancestors`; CSP3 §3.3 |
| `X-Frame-Options` | no | MDN: meta "has no effect" |
| `Strict-Transport-Security` | no | RFC 6797 §8.5: UAs must not heed it in meta |
| `Referrer-Policy` | yes, via `<meta name="referrer">` and per-element `referrerpolicy` | MDN `Referrer-Policy`; default when unset is `strict-origin-when-cross-origin`; header allows a fallback list, the attribute does not |
| `Set-Cookie` | no | MDN `http-equiv`: ignored by browsers |
| `Permissions-Policy` | no meta; header or iframe `allow` attribute | Permissions Policy ED §6.1–6.2 |
| other security headers (`X-Content-Type-Options`, COOP, COEP, CORP) | do not | MDN `http-equiv` warns not to set other security headers via meta (false sense of security) |

Front-end developers usually set the HTTP-only ones in host config (`_headers`, `vercel.json`, `netlify.toml`,
`next.config` `headers()`, middleware, nginx/Apache).

## Notes for skill authors

- Short skill: escape hatches + sanitize, no `eval`, `postMessage` origin checks, no secrets in public env, cookie
  flags, `window.open` noopener, meta-vs-header table (the most common mistake is putting `frame-ancestors`/XFO in
  meta). Reference file: strict CSP recipe, Trusted Types migration, OWASP links, supply-chain incident notes.
- Static checks for escape hatches are easy and reliable; deciding whether the value is "trusted" is not. Report as
  "review" (warning) when the source is unclear, error when the value flows from request/route/user input.
- Noisy/controversial: tokens in `localStorage` (debated; many SPAs must); SRI on CDNs that change files; CSP on static
  hosts without header control; `rel=noopener` on links is now redundant (do not flag missing `noopener` on
  `target=_blank` links as an error).
- CSP correctness needs the real response headers, so it is a runtime check. Lighthouse `main` best-practices has, in
  group `best-practices-trust-safety`, all with weight 0 (shown but not scored): `csp-xss`, `has-hsts`,
  `origin-isolation`, `clickjacking-mitigation`, `trusted-types-xss`. Map rules to them; they do not replace testing the
  deployed headers.
- Changes often (recheck): OWASP Top 10 edition, Trusted Types and Sanitizer API Baseline, CSP3 draft (still a Working
  Draft), npm token/2FA policy, framework env-var APIs (SvelteKit 3 replaced `$env/*` with explicit env variables),
  DOMPurify version (security releases follow bypass fixes).
- Never say a project "is secure" or "OWASP compliant"; automated checks find only part of the problems and a person
  must review authz, data flows and server config.

## Not verified

- React's handling of `javascript:` URLs in `href` (blocked vs warning, by version): react.dev page read does not cover it.
- `@braintree/sanitize-url` version, licence and size: not checked.
- Firefox and Safari default for cookies without `SameSite`: only Chromium's page was read; MDN says only "some browsers".
- `chalk@5.6.1` advisory GHSA-2v46-p5h4-248w and the full list of 2025-09-08 packages: seen in search results only.
- Whether `X-Content-Type-Options`, COOP, COEP, CORP are each ignored in meta: covered only by MDN's general warning, not
  per-header spec text.
- DOMPurify LICENSE file was not opened; licence comes from the npm registry field and the README.
