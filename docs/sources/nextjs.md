# Next.js: sources and candidate rules

Read on 2026-11-11. Primary sources:

- npm registry: https://www.npmjs.com/package/next, https://www.npmjs.com/package/eslint-config-next, https://www.npmjs.com/package/@next/eslint-plugin-next, https://www.npmjs.com/package/next-devtools-mcp
- Next.js blog: https://nextjs.org/blog, Next.js 16.4 post https://nextjs.org/blog/next-16-4 (published October 6th 2026)
- Docs index for the current version: https://nextjs.org/docs/llms.txt (header says `@doc-version: 16.4.6`)
- Docs pages (App Router): Project Structure https://nextjs.org/docs/app/getting-started/project-structure, Server and Client Components https://nextjs.org/docs/app/getting-started/server-and-client-components, Fetching Data https://nextjs.org/docs/app/getting-started/fetching-data, Mutating Data https://nextjs.org/docs/app/getting-started/mutating-data, Caching https://nextjs.org/docs/app/getting-started/caching, `use cache` https://nextjs.org/docs/app/api-reference/directives/use-cache, Server Actions guide https://nextjs.org/docs/app/guides/server-actions, Data Security https://nextjs.org/docs/app/guides/data-security, Environment Variables https://nextjs.org/docs/app/guides/environment-variables, Production checklist https://nextjs.org/docs/app/guides/production-checklist, Image https://nextjs.org/docs/app/api-reference/components/image, Font https://nextjs.org/docs/app/api-reference/components/font, Script https://nextjs.org/docs/app/api-reference/components/script, Lazy Loading https://nextjs.org/docs/app/guides/lazy-loading, ESLint https://nextjs.org/docs/app/api-reference/config/eslint, Accessibility https://nextjs.org/docs/architecture/accessibility, Hydration error https://nextjs.org/docs/messages/react-hydration-error, `redirect` https://nextjs.org/docs/app/api-reference/functions/redirect, `page` https://nextjs.org/docs/app/api-reference/file-conventions/page, `proxy` https://nextjs.org/docs/app/api-reference/file-conventions/proxy, AI agents https://nextjs.org/docs/app/guides/ai-agents, MCP https://nextjs.org/docs/app/guides/mcp

## Version (verified 2026-11-11)

| package | latest stable | published (registry `time`) | licence | notes |
|---|---|---|---|---|
| `next` | **16.4.6** | 2026-11-09 | MIT | 16.4.0 published 2026-10-06 (blog "Next.js 16.4", 2026-10-06). 16.0.0: 2025-10-22. 15.x LTS line latest 15.5.29. `canary` tag 16.5.0-canary.47: ignore. engines `node >=20.9.0`; peer `react ^18.2.0 || ^19.0.0` |
| `eslint-config-next` | **16.4.6** | 2026-11-09 | MIT | ships `core-web-vitals` and `typescript` sub-configs; ESLint 9 and 10 supported |
| `@next/eslint-plugin-next` | **16.4.6** | 2026-11-09 | MIT | |
| `next-devtools-mcp` | 0.4.0 | – | MIT | official MCP bridge |

16.4 highlights (blog): Cache Components now recommended for every app and on by default in new `create-next-app` projects (will become default in Next.js 17); `ensureStatic` route segment option; `navigation()` / `prefetch()` from `next/cache` to defer work; `next upgrade --agent`; `experimental.agentUpgrade` (default policy `'security'`); experimental Rust React Compiler; ships React 19.3. Security: the blog shows monthly scheduled security releases since July 2026 plus out-of-band updates (latest: "November 2026 Security Release", 2026-11-03). Rules must say "stay on the latest patch" rather than pin a number.

## Stack detection

| signal | meaning |
|---|---|
| `next` in `dependencies` | Next.js (high confidence) |
| `next.config.js` / `next.config.mjs` / `next.config.ts` at project root | Next.js config (docs: next-config-js page and TypeScript page) |
| `app/` (or `src/app/`) with `layout.(js|jsx|tsx)` and `page.(js|jsx|tsx)` | App Router |
| `pages/` (or `src/pages/`), `pages/_app.*`, `pages/_document.*` | Pages Router (both routers can coexist) |
| `proxy.ts` at root (or legacy `middleware.ts`) | request proxy; `middleware` is deprecated and renamed to `proxy` in 16 |
| `instrumentation.ts`, `next-env.d.ts`, `.env*`, `eslint.config.mjs`, `public/` | supporting files from the project-structure table |
| other file conventions: `loading`, `error`, `global-error`, `not-found`, `route` (.js/.ts), `template`, `default`; metadata files `opengraph-image`, `icon`, `sitemap`, `robots` | App Router features in use |
| folders `[slug]`, `[...slug]`, `[[...slug]]`, `(group)`, `_private`, `@slot`, `(.)x` | dynamic, grouped, private, parallel, intercepting routes |
| `cacheComponents: true` (+ `partialPrefetching`) in next.config | Cache Components model: use `use cache` rules, not the previous `revalidate`/`dynamic` segment-config model |
| `reactCompiler: true` in next.config | React Compiler enabled |
| `output: 'export'` in next.config | static export: no server features (see Not verified for the exact feature list) |
| `AGENTS.md` with `<!-- BEGIN:nextjs-agent-rules -->` | Next.js 16.2+ managed agent block present |

## Static check: eslint-config-next 16.4.6

`next lint` was removed in Next.js 16; use the ESLint CLI with `eslint.config.mjs` importing `eslint-config-next/core-web-vitals` (and `eslint-config-next/typescript` for TS). It bundles the recommended sets of `eslint-plugin-react`, `eslint-plugin-react-hooks` and `@next/eslint-plugin-next`; `core-web-vitals` turns CWV-related rules into errors (https://nextjs.org/docs/app/api-reference/config/eslint). The accessibility page says `eslint-plugin-jsx-a11y` is included and warns on `aria-props`, `aria-proptypes`, `aria-unsupported-elements`, `role-has-required-aria-props`, `role-supports-aria-props` (https://nextjs.org/docs/architecture/accessibility).

`@next/next/*` rules (all in recommended): `google-font-display`, `google-font-preconnect`, `inline-script-id`, `next-script-for-ga`, `no-assign-module-variable`, `no-async-client-component`, `no-before-interactive-script-outside-document`, `no-css-tags`, `no-document-import-in-page`, `no-duplicate-head`, `no-head-element`, `no-head-import-in-document`, `no-html-link-for-pages`, `no-img-element`, `no-page-custom-font`, `no-script-component-in-head`, `no-styled-jsx-in-document`, `no-sync-scripts`, `no-title-in-document-head`, `no-typos`, `no-unwanted-polyfillio`.

## Components: Server and Client

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `next/server-components-default` | Keep components as Server Components unless they need state, event handlers, Effects, browser APIs or custom Hooks. | Server Components send no JS for themselves. | Server and Client Components, "When to use…" | Next App Router | static: `'use client'` file with no hooks/handlers/browser API | `'use client'` on static layout → remove | – | warning |
| `next/use-client-at-leaves` | Put `'use client'` on the small interactive component, not on large layouts or pages. | Everything imported below the boundary joins the client bundle. | …/server-and-client-components#reducing-js-bundle-size | Next App Router | static: `'use client'` in `layout.*`/`page.*` | client `layout.tsx` → client `<Search/>` only | – | warning |
| `next/no-async-client-component` | Do not make Client Components `async`. | Not supported; only Server Components can be async. | ESLint `@next/next/no-async-client-component` | Next | static: lint rule | `'use client'` + `async function` → fetch in server parent or `use()` | – | error |
| `next/serializable-client-props` | Pass only serializable props from Server to Client Components. | Props cross the RSC payload. | …/server-and-client-components#passing-data-from-server-to-client-components | Next App Router | runtime/build error; static heuristic: function prop (not a Server Action) into a client component from a server file | `onClick={fn}` from server → define handler in client | – | error |
| `next/providers-deep` | Render context providers as deep as possible and wrap only `{children}`, not the whole `<html>`. | Lets Next optimise static Server Component parts. | …/server-and-client-components#context-providers | Next App Router | manual | provider around `<html>` → inside `<body>` around children | – | info |
| `next/server-only-modules` | Mark modules that hold secrets or DB access with `import 'server-only'`. | Accidental client import fails the build instead of leaking. | …/server-and-client-components#preventing-environment-poisoning; Data Security guide | Next App Router | static: file reads `process.env.<non-NEXT_PUBLIC>` or DB client without `server-only` | – | `server-only@0.0.1`, MIT (registry; Next handles the import internally) | warning |
| `next/link-for-internal` | Navigate between internal pages with `<Link>`, not `<a href>`. | Client navigation, prefetching, route announcer. | ESLint `@next/next/no-html-link-for-pages`; Production checklist | Next | static: lint rule (Pages Router dirs) + `<a href="/…">` in App Router | `<a href="/about">` → `<Link href="/about">` | – | warning |
| `next/no-head-element` | Use the Metadata API (`metadata` / `generateMetadata`) instead of a raw `<head>` element or `next/head` in App Router. | Metadata API dedupes and streams tags correctly. | ESLint `@next/next/no-head-element`; Production checklist "Metadata API" | Next | static: lint rule | `<head><title>` → `export const metadata` | – | warning |

## Data fetching and caching

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `next/fetch-in-server-components` | Fetch data in Server Components (fetch, ORM) rather than in client Effects where possible. | Closer to the source, no client waterfall, secrets stay on server. | Fetching Data; Production checklist | Next App Router | static (heuristic): `useEffect`+`fetch` in a `'use client'` file under `app/` | client Effect fetch → async Server Component | – | info |
| `next/no-route-handler-from-server` | Do not call your own Route Handlers from Server Components; call the data function directly. | Extra server round-trip. | Production checklist, "Route Handlers" | Next App Router | static: `fetch('/api/…')` or `fetch(\`${base}/api…\`)` in a server file | `fetch('/api/posts')` → `getPosts()` | – | warning |
| `next/parallel-fetch` | Start independent requests together (`Promise.all` or separate components) instead of awaiting one after another. | Sequential awaits create waterfalls. | Fetching Data, "Parallel data fetching"; Production checklist | Next | static (heuristic): two consecutive independent `await` fetches | `await a(); await b()` → `Promise.all` | – | warning |
| `next/suspense-around-runtime-data` | Wrap components that read `cookies()`, `headers()`, `searchParams`, `params` or uncached data in `<Suspense>` (or `loading.js`). | Rest of route can prerender/stream; without Cache Components the whole route becomes dynamic. | Caching, "Working with runtime APIs"; Production checklist | Next App Router | build: Cache Components "blocking-route" error; static heuristic: `await cookies()` in layout with no Suspense | runtime read in root layout → Suspense child | – | warning |
| `next/layout-runtime-data-not-covered-by-loading` | Do not read uncached or runtime data in a layout expecting the same segment's `loading.js` to cover it; wrap that read in its own `<Suspense>` or move it to the page. | `loading.js` sits inside the layout, so the layout blocks navigation. | Fetching Data, "With loading.js" | Next App Router | static: `cookies()`/`headers()`/uncached fetch in `layout.*` | – | – | warning |
| `next/use-cache-with-cachelife` | When Cache Components is on, pair each `'use cache'` with a `cacheLife` profile. | Otherwise an implicit `default` profile applies. | Caching, "Usage" (Good to know) | Next ≥16 + cacheComponents | static: `'use cache'` function without `cacheLife(` | – | – | info |
| `next/no-request-apis-in-use-cache` | Never read `cookies()`, `headers()` or `searchParams` inside a `'use cache'` scope (including helpers it calls); read outside and pass as arguments. | Error `next-request-in-use-cache`; may pass build and fail at runtime. | `use cache`, "Constraints" | Next + cacheComponents | static: request API call reachable from a `'use cache'` function (direct calls easy, transitive harder) | `'use cache'; await cookies()` → pass `sessionId` prop | – | error |
| `next/explicit-random-time` | Under Cache Components, handle `Math.random()`, `Date.now()`, `crypto.randomUUID()` explicitly: call `connection()` first (per request) or put them in a cached scope. | Otherwise the value is frozen into the prerendered shell or errors. | Caching, "Random values and timestamps" | Next + cacheComponents | static: these calls in server components without `connection()`/`'use cache'` | – | – | warning |
| `next/await-params` | Treat `params` and `searchParams` as Promises: `await` them or use React `use()`. | Sync access is a back-compat path slated for deprecation. | `page` file convention | Next ≥15 | static: `params.slug` without await in page/layout/route | `params.id` → `(await params).id` | – | warning |
| `next/validate-params` | Validate dynamic route params and searchParams as user input. | Bracket folders are user input. | Data Security, "Auditing" | Next | manual / static heuristic: `params` used in DB query without parse | – | – | warning |

## Mutations: Server Actions / Server Functions

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `next/action-auth-inside` | Check authentication and authorization (ownership) inside every Server Action, not only in proxy, layout or page. | Each exported action is reachable by direct POST. | Data Security, "Built-in Server Actions Security features", "Authentication and authorization"; Production checklist | Next | static (heuristic): `'use server'` exported async fn with no auth/session call; manual | page-level redirect only → `auth()` in action | – | error |
| `next/action-validate-input` | Validate every Server Action argument (FormData, ids) on the server. | Client input is trivially modified. | Data Security, "Validating client input"; react.dev `'use server'` security | Next | static (heuristic): `formData.get(` used without schema/type check | – | zod (size not verified) | error |
| `next/action-minimal-return` | Return only what the UI needs from a Server Action, never whole DB records. | Return values are serialized to the client. | Data Security, "Controlling return values" | Next | static (heuristic): `return db.…` / `return await prisma.…` in `'use server'` file | `return db.user.update()` → `return { success: true }` | – | warning |
| `next/data-access-layer` | Keep DB access and `process.env` secrets in a `server-only` Data Access Layer that returns safe DTOs. | Narrows what can leak and what to audit. | Data Security, "Data Access Layer" | Next | static: DB client import outside designated folder | – | – | info |
| `next/no-mutation-in-render` | Do not mutate (logout, DB writes, revalidate, set cookies) as a side effect of rendering; use Server Actions. | Prefetch/render can trigger it unintentionally; Next blocks some cases. | Data Security, "Avoiding side-effects during rendering" | Next | static: `cookies().set`/`revalidatePath` in a component body | – | – | error |
| `next/redirect-outside-try` | Call `redirect()` outside `try` blocks, and revalidate before it. | `redirect` throws a control-flow error a `catch` would swallow. | `redirect` reference; Mutating Data "Redirect after a mutation" | Next | static: `redirect(` inside `try {}` | – | – | error |
| `next/actions-not-for-fetching` | Do not use Server Actions for reads or parallel work; the client dispatches them one at a time. | `Promise.all` of actions runs sequentially. | Server Actions guide, "Sequential dispatch on the client"; Mutating Data | Next | static: `Promise.all([action1(), action2()])` in client code | – | – | warning |
| `next/revalidate-after-mutation` | After a mutation, call `revalidatePath`/`revalidateTag`/`updateTag` (or `refresh`) so the UI shows fresh data. | Otherwise cached data stays stale. | Mutating Data, "Revalidate data" | Next | manual | – | – | info |

## Rendering modes

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `next/enable-cache-components` | For new or migrating App Router apps on 16.4+, enable `cacheComponents` and set `partialPrefetching` explicitly. | Recommended model from 16.4; leaving `partialPrefetching` unset logs a warning; default in 17. | Caching, "Enabling Cache Components"; blog 16.4 | Next ≥16.4 | static: next.config lacks flags | – | – | info |
| `next/ensure-static-for-static-sites` | On pages meant to be fully static (marketing, blog, shop), set `export const ensureStatic = 'navigation'` (or `'shell'`/`'prefetch'`) so a dynamic component fails the build. | Guards against accidental request-time rendering cost. | blog 16.4; route segment config `ensureStatic` | Next ≥16.4 | static: presence of export | – | – | info |
| `next/hydration-safe-render` | Avoid hydration mismatches: valid HTML nesting (no `<div>`/`<p>` in `<p>`, no nested `<a>`/`<button>`), no `typeof window`/`localStorage`/`Date()` in render. | Mismatch errors and re-rendering. | https://nextjs.org/docs/messages/react-hydration-error | Next | static: invalid nesting in JSX, browser API in render | `<p><div>` → `<div><div>` | – | error |
| `next/ssr-false-in-client-only` | Use `dynamic(…, { ssr: false })` only inside Client Components. | Not allowed in Server Components (error). | Lazy Loading, "Skipping SSR" | Next App Router | static: `ssr: false` in a file without `'use client'` | – | – | error |

## Accessibility

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `next/unique-page-title` | Give each route a unique, descriptive title (Metadata API). | The built-in route announcer reads `document.title`, then `<h1>`, then pathname on client navigation. | Accessibility, "Route Announcements" | Next | static: routes with no `metadata.title`/`generateMetadata`; runtime: duplicate titles across crawled routes | – | – | warning |
| `next/image-alt` | Give every `next/image` an `alt` that can replace the image; use `alt=""` for decorative images. | Screen readers and fallback text. | Image, `alt` | Next | static: `<Image>` without `alt` (jsx-a11y `alt-text`) | – | – | error |
| `next/jsx-a11y-enabled` | Keep `eslint-plugin-jsx-a11y` rules on (they come with `eslint-config-next`). | Catches ARIA/role mistakes early; automated checks find only part of the problems. | Accessibility, "Linting"; Production checklist | Next | static: eslint config | – | – | info |
| `next/global-error-and-not-found` | Provide `app/global-error.tsx` (and a global 404) for accessible recovery UI. | Uncaught errors otherwise show a bare page. | Production checklist, "UI and accessibility" | Next App Router | static: file missing | – | – | info |

## Performance (built-in components)

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `next/use-next-image` | Use `next/image` instead of `<img>`. | Optimised formats, sizes, no layout shift; `<img>` hurts LCP. | ESLint `@next/next/no-img-element`; Image docs | Next | static: lint rule | `<img>` → `<Image>` | – | warning (error in core-web-vitals) |
| `next/image-sizes-with-fill` | Set `sizes` when using `fill` or CSS-responsive images. | Without it the browser assumes `100vw` and downloads too much. | Image, `sizes` | Next | static: `<Image fill` without `sizes` | – | – | warning |
| `next/lcp-image-eager` | For the LCP/hero image use `loading="eager"` or `fetchPriority="high"` (or `preload` in narrow cases); `priority` is deprecated since 16. | Faster LCP; `preload` misfires when several images may be LCP. | Image, `preload` and `priority` | Next ≥16 | static: `priority` prop (deprecated) | `priority` → `fetchPriority="high"` | – | warning |
| `next/remote-patterns` | Allow external images with narrow `images.remotePatterns`, not broad wildcards. | Only your own sources get optimised. | Image, `remotePatterns` | Next | static: next.config `hostname: '**'` | – | – | warning |
| `next/no-svg-optimization` | Keep `dangerouslyAllowSVG` off; serve SVG with `unoptimized` (automatic for `.svg`), and add CSP if you must enable it. | SVG can carry script. | Image, `dangerouslyAllowSVG` | Next | static: `dangerouslyAllowSVG: true` without `contentSecurityPolicy` | – | – | error |
| `next/use-next-font` | Load fonts through `next/font` (self-hosted at build, no request to Google from the browser) rather than `<link>` to font CDNs. | No layout shift, privacy, fewer connections. | Font docs; ESLint `no-page-custom-font`, `google-font-display`, `google-font-preconnect` | Next | static: `<link href="https://fonts.googleapis.com/css2?family=Inter">` | `<link>` → `next/font/google` | – | warning |
| `next/script-strategy` | Load third-party scripts with `next/script` and the lightest strategy (`afterInteractive` default, `lazyOnload` for non-urgent); `beforeInteractive` only for critical scripts in the root layout. | Avoids blocking the main thread. | Script docs; ESLint `no-sync-scripts`, `inline-script-id`, `next-script-for-ga`, `no-before-interactive-script-outside-document` | Next | static: lint rules; `<script src>` in JSX | `<script src>` → `<Script strategy="lazyOnload">` | – | warning |
| `next/lazy-load-client` | Lazy-load heavy Client Components and libraries with `next/dynamic` or `import()` on demand. | Smaller initial JS. | Lazy Loading guide | Next | manual (bundle analyzer) | – | – | info |
| `next/react-compiler` | Consider `reactCompiler: true` (needs `babel-plugin-react-compiler`); then avoid adding manual memo in new code. | Automatic memoization. | next-config-js `reactCompiler`; React Compiler docs | Next ≥16 | static: config flag | – | – | info |

## Security and configuration

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `next/public-env-only-public` | Prefix with `NEXT_PUBLIC_` only values that are safe to publish; everything else stays server-only. | `NEXT_PUBLIC_` values are inlined into the browser bundle at build. | Environment Variables, "Bundling environment variables for the browser"; Production checklist | Next | static: `NEXT_PUBLIC_*` names containing SECRET/KEY/TOKEN/PASSWORD (heuristic) | `NEXT_PUBLIC_STRIPE_SECRET` → `STRIPE_SECRET` read on server | – | error |
| `next/public-env-build-time` | Do not expect `NEXT_PUBLIC_` values to change after build, and do not read them by dynamic key. | Frozen at `next build`; `process.env[name]` is not inlined. | Environment Variables | Next | static: `process.env[` with variable in client code | – | – | warning |
| `next/env-files-ignored` | Keep `.env*` files out of version control. | Secrets leak via the repo. | Environment Variables (Warning); Project Structure table | Next | static: `.env*` tracked / missing from `.gitignore` | – | – | error |
| `next/csp` | Consider a Content Security Policy (nonce-based for dynamic pages). | Mitigates XSS and injection. | Production checklist; https://nextjs.org/docs/app/guides/content-security-policy | Next | runtime: response headers | – | – | info |
| `next/stay-patched` | Track Next.js security releases (monthly scheduled plus out-of-band) and stay on the latest patch of your major. | RSC/upstream critical issues were patched repeatedly in 2025–2026. | https://nextjs.org/blog (security release posts) | Next | static: installed version vs registry `latest` | – | – | error |
| `next/audit-proxy-and-routes` | Give `proxy.ts` and `route.ts` handlers a traditional security review; do not rely on proxy alone for auth. | They are powerful entry points. | Data Security, "Auditing"; Production checklist | Next | manual | – | – | warning |

## Notes for skill authors

- Short skill: server-by-default + small client leaves, `'use server'` = public endpoint (auth + validate + minimal return), `NEXT_PUBLIC_` exposure, Suspense around runtime data, Image/Font/Script, unique titles. Run `eslint-config-next/core-web-vitals` as the static check.
- Reference file: Cache Components details (`use cache`, `cacheLife`, `connection()`, `ensureStatic`, `navigation()`), the full `@next/next/*` table, hydration causes.
- Two caching models coexist: Cache Components (`cacheComponents: true`) and the "Previous Model" (https://nextjs.org/docs/app/guides/caching-without-cache-components). Detect the flag before applying caching rules; don't mix advice.
- Changes very often: 16.2 → 16.4 in seven months added `proxy`, `ensureStatic`, Partial Prefetching, agent tooling. Recheck https://nextjs.org/docs/llms.txt (`@doc-version`) each release; prefer the version-matched docs in `node_modules/next/dist/docs/` (16.2+).
- Noisy: `next/server-components-default` and `next/parallel-fetch` heuristics; keep them warning/info. `no-html-link-for-pages` only scans `pages/` by default.
- Pages Router projects: most data rules above are App Router only; check which router per directory.
- Manual only: whether an action's auth check is correct, whether a value is truly public, whether titles are descriptive.

## AI-agent resources (official)

- `https://nextjs.org/docs/llms.txt` (index) and `https://nextjs.org/docs/llms-full.txt` (full current docs); every docs page has a `.md` twin.
- Bundled version-matched docs at `node_modules/next/dist/docs/` (16.2+) and a managed `AGENTS.md` block written by `create-next-app` / `next dev` (on by default since 16.3; configure via `agentRules`) — https://nextjs.org/docs/app/guides/ai-agents
- MCP: dev server endpoint `/_next/mcp` (Next 16+, enabled by default, disable with `experimental.mcpServer: false`); client bridge `next-devtools-mcp` — https://nextjs.org/docs/app/guides/mcp
- Official agent skills: `npx skills add vercel/next.js --skill <name>` (`next-dev-loop`, `next-bundle-optimizer`, `next-cache-components-adoption`, `next-cache-components-optimizer`, `next-partial-prefetching-adoption`, `next-partial-prefetching-optimizer`) — https://nextjs.org/docs/app/guides/ai-agents
- `npx next@canary upgrade --agent=latest` for agent-guided upgrades (blog 16.4).

Our installer should not overwrite the managed `AGENTS.md` block between `<!-- BEGIN:nextjs-agent-rules -->` and `<!-- END:nextjs-agent-rules -->`.

## Not verified

- The Vercel blog post "Common mistakes with the Next.js App Router" was not used: it is on vercel.com, not in nextjs.org/docs, and the brief asks for official docs only. Its points that also appear in the docs (Route Handlers from Server Components, redirect in try/catch, Suspense placement) are covered above.
- Exact feature list unsupported by `output: 'export'`: page downloaded list not read in this pass.
- `next.config.mts` / `.cjs` support: docs pages read mention only `.js`, `.mjs`, `.ts`.
- Severity mapping in `core-web-vitals` (which `@next/next` rules become errors): docs say "certain" rules; list not read.
- zod size and licence: not checked.
- Whether `eslint-config-next` 16.4.6 enables the compiler-powered react-hooks rules (it uses react-hooks `recommended`; which version of the preset was not diffed).
