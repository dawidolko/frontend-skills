# Astro: sources and candidate rules

Read on 2026-11-11. Primary sources:

- npm registry: `astro` (https://www.npmjs.com/package/astro), `@astrojs/check` (https://www.npmjs.com/package/@astrojs/check) (data from https://registry.npmjs.org/<name>)
- Astro blog: "Astro 7" (https://astro.build/blog/astro-7/, June 22 2026), "Astro 7.4" (https://astro.build/blog/astro-740/, October 15 2026)
- Upgrade to v7 (https://docs.astro.build/en/guides/upgrade-to/v7/)
- Configuring Astro (https://docs.astro.build/en/guides/configuring-astro/), Configuration reference (https://docs.astro.build/en/reference/configuration-reference/)
- Islands (https://docs.astro.build/en/concepts/islands/), Template directives (https://docs.astro.build/en/reference/directives-reference/), Server islands (https://docs.astro.build/en/guides/server-islands/), On-demand rendering (https://docs.astro.build/en/guides/on-demand-rendering/)
- Images (https://docs.astro.build/en/guides/images/), `astro:assets` reference (https://docs.astro.build/en/reference/modules/astro-assets/)
- Styling (https://docs.astro.build/en/guides/styling/), Client-side scripts (https://docs.astro.build/en/guides/client-side-scripts/), Prefetch (https://docs.astro.build/en/guides/prefetch/), View transitions (https://docs.astro.build/en/guides/view-transitions/)
- Environment variables (https://docs.astro.build/en/guides/environment-variables/)
- Dev toolbar (https://docs.astro.build/en/guides/dev-toolbar/), CLI (https://docs.astro.build/en/reference/cli-reference/)
- AI tools (https://docs.astro.build/en/guides/build-with-ai/)

## Version and status (verified 2026-11-11)

| package | latest | published | licence (registry) | note |
|---|---|---|---|---|
| `astro` | 7.4.10 | 2026-11-10 | MIT | 7.0.0 published 2026-06-22 (blog Astro 7, June 22 2026); 6.0.0 on 2026-03-10; `beta` = 7.4.4-beta.0 (older than latest), `legacy` = 4.16.19 |
| `@astrojs/check` | 0.9.12 | 2026-10-21 | MIT | needed by `astro check` |

Astro 7 headline changes (https://docs.astro.build/en/guides/upgrade-to/v7/): Vite 8; Rust compiler is the only compiler and is stricter (unclosed tags error; invalid nesting such as `<div>` in `<p>` is no longer auto-fixed); `src/fetch.ts` is a reserved file (advanced routing); default Markdown processor is Sätteri (remark/rehype plugins need `@astrojs/markdown-remark` + `unified()`); `compressHTML` default changed from `true` to `'jsx'` (whitespace between inline elements is stripped); route caching, queued rendering, logger stable.

## Detection (for stack detection)

| signal | meaning | source |
|---|---|---|
| `astro` in `package.json` deps | Astro | npm |
| `astro.config.mjs` (recommended), `astro.config.ts`, `astro.config.js` | Astro config | https://docs.astro.build/en/guides/configuring-astro/ (`.mjs` default, `.ts` for TS, `.js` supported); `.cjs`/`.mts` Not verified |
| `src/pages/**/*.astro`, `*.astro` components | Astro | – |
| `@astrojs/react|vue|svelte|preact|solid-js` deps | framework islands present → also apply that framework's rules | https://docs.astro.build/en/concepts/islands/ |
| an adapter dep (`@astrojs/node`, `@astrojs/netlify`, `@astrojs/vercel`, `@astrojs/cloudflare`) or `output: 'server'` | on-demand rendering possible | https://docs.astro.build/en/guides/on-demand-rendering/ |
| `export const prerender = false` in a page | that route is server-rendered | same |
| `server:defer` on a component | server island | https://docs.astro.build/en/guides/server-islands/ |
| `src/fetch.ts` (v7) / `src/middleware.ts` | advanced routing / middleware | upgrade guide |
| `@tailwindcss/vite` in deps + `@import "tailwindcss"` in `src/styles/global.css` = Tailwind 4; `@astrojs/tailwind` = legacy Tailwind 3 integration | styling | https://docs.astro.build/en/guides/styling/ ("Tailwind") |

## Components, islands and rendering

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| astro/static-by-default | Render UI framework components without a `client:*` directive unless they need interactivity. | Without a directive they ship as HTML with zero JS. | https://docs.astro.build/en/reference/directives-reference/ ("Client Directives") | Astro | static: count `client:` directives per page | `<Footer client:load />` (static) → `<Footer />` | – | warning |
| astro/pick-lowest-client-directive | Use `client:load` only for immediately needed interactive UI; prefer `client:idle` for lower priority and `client:visible` (optionally with `rootMargin`) for below-the-fold, `client:media` for size-specific UI. | Defers JS and improves load. | https://docs.astro.build/en/reference/directives-reference/ (client:load / idle / visible / media priorities) | Astro | static: `client:load` on components placed after the first screen (manual) | `client:load` on a footer carousel → `client:visible` | – | info |
| astro/client-only-needs-framework | Pass the framework name to `client:only` and provide `slot="fallback"` content. | Astro cannot infer the renderer; avoids blank space. | https://docs.astro.build/en/reference/directives-reference/ (`client:only`) | Astro | static: `client:only` without a value | `client:only` → `client:only="react"` | – | error |
| astro/directive-on-direct-import | Use `client:*` only on UI framework components imported directly into a `.astro` file, not on dynamic tags or components passed through props. | Directives are unsupported there and silently do nothing. | https://docs.astro.build/en/reference/directives-reference/ | Astro | static | – | – | warning |
| astro/no-directive-in-spread | Write directives literally on the element, not inside a spread object. | The compiler must see them. | https://docs.astro.build/en/reference/directives-reference/ ("Rules") | Astro | static: `{...attrs}` objects containing `client:` keys | – | – | warning |
| astro/server-island-serializable-props | Pass only small, serializable props (no functions, no circular objects) to `server:defer` components and always add a `slot="fallback"`. | Props travel in an encrypted GET URL; over 2048 bytes Astro switches to an uncached POST. | https://docs.astro.build/en/guides/server-islands/ ("Passing props", "Caching", "fallback content") | Astro + adapter | static: function props on `server:defer`; missing fallback | – | – | warning |
| astro/server-islands-need-adapter | Install an adapter before using `server:defer` or `prerender = false`. | Delayed rendering needs a server runtime. | https://docs.astro.build/en/guides/on-demand-rendering/; https://docs.astro.build/en/guides/server-islands/ | Astro | static: `server:defer`/`prerender = false` with no adapter dep | – | – | error |
| astro/prerender-default | Keep pages prerendered and opt individual routes out with `export const prerender = false`; use `output: 'server'` only for mostly dynamic apps. | Static HTML is fastest; personalization can live in server islands. | https://docs.astro.build/en/guides/on-demand-rendering/ | Astro | static | – | – | info |
| astro/valid-html-v7 | Close every non-void element and avoid invalid nesting (e.g. block elements inside `<p>`). | The v7 Rust compiler errors on unclosed tags and no longer repairs invalid nesting. | https://docs.astro.build/en/guides/upgrade-to/v7/ ("Rust compiler") | Astro 7 | static: build; HTML validator | `<p><div>` → `<div><p>` | – | error |
| astro/v7-whitespace | After upgrading to v7, check inline elements for lost spaces and add `{" "}` where needed (or set `compressHTML: true`). | Default `compressHTML: 'jsx'` strips whitespace between inline elements. | https://docs.astro.build/en/guides/upgrade-to/v7/ ("compressHTML: 'jsx'") | Astro 7 | manual / visual diff | `<b>a</b>\n<i>b</i>` → `<b>a</b>{" "}<i>b</i>` | – | warning |
| astro/no-src-fetch-collision | Do not use `src/fetch.ts` for anything but advanced routing (or set `fetchFile`). | Reserved file name in v7. | https://docs.astro.build/en/guides/upgrade-to/v7/ ("Reserved file name") | Astro 7 | static: file exists and does not export routing config (manual) | – | – | warning |

## Styling and scripts

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| astro/scoped-styles-first | Use component-scoped `<style>` by default; use `is:global` or `:global()` only where needed. | Scoped styles do not leak. | https://docs.astro.build/en/guides/styling/ ("Scoped Styles") | Astro | static: count `is:global` | – | – | info |
| astro/class-list | Combine conditional classes with `class:list`. | Built in, no helper needed. | https://docs.astro.build/en/guides/styling/ ("class:list") | Astro | static | template-literal class strings → `class:list={['box', {red}]}` | – | info |
| astro/processed-scripts | Prefer processed `<script>` tags (bundled, deduplicated, TS, `type=module`) and use `is:inline` only on purpose. | Any attribute except `src` implies `is:inline`, which skips bundling and dedupe; `define:vars` on scripts also inlines. | https://docs.astro.build/en/guides/client-side-scripts/; https://docs.astro.build/en/reference/directives-reference/ (`is:inline`, `define:vars`) | Astro | static: `<script` with attributes other than `src` | `<script define:vars={{x}}>` → `data-*` attribute + processed script | – | info |
| astro/custom-elements-for-vanilla | For small interactive bits without a framework, wrap markup in a custom element defined in a processed `<script>`. | Runs once per page, scoped to each instance. | https://docs.astro.build/en/guides/client-side-scripts/ ("Web components with custom elements") | Astro | manual | `document.querySelector` globals → `customElements.define(...)` | – | info |

## Accessibility

Helps you work to WCAG 2.2 AA; Astro's own audits are explicitly not a replacement for Lighthouse, Pa11y or human testing.

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| astro/image-alt | Give every `<Image />`/`<Picture />` an `alt`; use `alt=""` only for decorative images. | `alt` is required by the component; empty alt hides decoration from AT. | https://docs.astro.build/en/reference/modules/astro-assets/ ("alt (required)") | Astro | static: build error / grep | – | – | error |
| astro/title-per-page | Include a unique `<title>` on every page, especially with `<ClientRouter />`. | The route announcer reads the title after client-side navigation. | https://docs.astro.build/en/guides/view-transitions/ ("Accessibility", "Route announcement") | Astro | static: page/layout without `<title>` | – | – | warning |
| astro/view-transitions-reduced-motion | Rely on `<ClientRouter />`'s built-in `prefers-reduced-motion` handling and keep any custom animations behind the same media query. | Avoids motion for users who opted out. | https://docs.astro.build/en/guides/view-transitions/ ("prefers-reduced-motion") | Astro | static: custom `transition:animate` without reduced-motion CSS (manual) | – | – | info |
| astro/dev-toolbar-audit | Use the dev toolbar Audit app during development as a first pass for common a11y and performance issues. | Catches basics early; not complete. | https://docs.astro.build/en/guides/dev-toolbar/ ("Audit") | Astro | runtime: dev toolbar | – | – | info |

## Performance

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| astro/images-in-src | Keep local images in `src/` and render them with `<Image />`/`<Picture />`; `public/` images are never optimized and need explicit `width`/`height`. | Astro transforms and sizes `src/` images, preventing CLS. | https://docs.astro.build/en/guides/images/ ("src/ vs public/"); https://docs.astro.build/en/reference/modules/astro-assets/ (width and height) | Astro | static: `<img src="/...">` for large images; `<Image>` on public path without width/height | `<img src="/hero.jpg">` → `<Image src={hero} alt=… />` | – | warning |
| astro/lcp-image-priority | Add `priority` to the above-the-fold (LCP) `<Image />`/`<Picture />`. | Sets eager loading and high fetch priority. | https://docs.astro.build/en/reference/modules/astro-assets/ (`priority`, astro@5.10.0) | Astro ≥5.10 | runtime: Lighthouse `lcp-lazy-loaded` | – | – | warning |
| astro/authorize-remote-images | List remote image hosts in `image.domains`/`image.remotePatterns`. | Only authorized remote images are optimized; also a safety layer. | https://docs.astro.build/en/guides/images/ ("Authorizing remote images") | Astro | static: remote `src` on `<Image>` whose host is not in config | – | – | info |
| astro/prefetch-links | Enable prefetch and add `data-astro-prefetch` (default strategy `hover`) to likely-next links. | Faster navigations. | https://docs.astro.build/en/guides/prefetch/ | Astro | static | – | – | info |

## Security

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| astro/set-html-trusted-only | Use `set:html` only with trusted or escaped/sanitized HTML. | Astro does not escape it (XSS). | https://docs.astro.build/en/reference/directives-reference/ (`set:html`) | Astro | static: `set:html=` | `set:html={userBio}` → `{userBio}` or sanitize | sanitizer: see security file | error |
| astro/secrets-server-only | Keep secrets server-side: no `PUBLIC_` prefix, and prefer `astro:env` with `envField.*({ context: "server", access: "secret" })`. | Only `PUBLIC_` vars reach the client; the schema enforces context. | https://docs.astro.build/en/guides/environment-variables/ | Astro | static: secret-looking names with `PUBLIC_` prefix; `import.meta.env.SECRET` in client scripts/islands | – | – | error |
| astro/keep-check-origin | Leave `security.checkOrigin` on (default) for on-demand pages and set `security.allowedDomains` when behind a proxy that rewrites host headers. | CSRF protection for form posts. | https://docs.astro.build/en/reference/configuration-reference/ (`security.checkOrigin`, `security.allowedDomains`) | Astro SSR | static: `checkOrigin: false` | – | – | error |
| astro/csp | Consider `security.csp` (Astro ≥6) for hashed scripts/styles; it does not work with `<ClientRouter />`, Shiki, or in dev mode. | Defense in depth against XSS; limits are documented. | https://docs.astro.build/en/reference/configuration-reference/ (`security.csp`) | Astro ≥6 | static: config | – | – | info |

## Official tooling

- `astro check` (needs `@astrojs/check` 0.9.12 and `typescript`): type-checks `.astro` files and exits 1 on errors; intended for CI (https://docs.astro.build/en/reference/cli-reference/ "astro check").
- Dev toolbar Audit app (runtime, dev only).
- No official Astro ESLint plugin was found in the Astro docs read; `eslint-plugin-astro` is community-maintained (Not verified as official).

## AI-agent resources (verified 2026-11-11)

- Astro Docs MCP server: `https://mcp.docs.astro.build/mcp` (Streamable HTTP, uses kapa.ai index), setup in https://docs.astro.build/en/guides/build-with-ai/.
- Dev server exposes `/_astro/status` returning `{"ok": true}` for agents; Astro 7 adds `astro dev --background` and JSON logging (https://docs.astro.build/en/guides/build-with-ai/, https://astro.build/blog/astro-7/).
- llms.txt: https://docs.astro.build/llms.txt and https://astro.build/llms.txt returned 404 on 2026-11-11 → none listed.

## Notes for skill authors

- Short skill: islands/directive choice, `set:html`, `alt` on `<Image>`, `priority` on LCP image, secrets, v7 HTML strictness. Reference file: server islands caching, CSP limits, prefetch, scripts.
- Astro pages often host React/Vue/Svelte islands; detection should add those framework skills too.
- v7 is five months old; v6 projects are common. `compressHTML` and compiler strictness rules apply only to v7.
- "Which client directive" is judgement; keep as info, not error.

## Not verified

- Support for `astro.config.cjs`/`.mts` names (only `.mjs`, `.ts`, `.js` confirmed).
- Whether `eslint-plugin-astro` / `eslint-plugin-jsx-a11y` integration is endorsed in current Astro docs.
- Size of the client runtime per directive (no official number read).
