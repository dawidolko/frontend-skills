# Next.js reference

Depth for the `fe-nextjs` skill, for Next.js 16 with the App Router (latest stable checked 2026-11-11 on the npm registry: 16.4.6; React 19.3). Rule ids in brackets: `frontend-skills explain <id>`. Security releases come monthly and out of band: stay on the latest patch of your major.

## Changes from 15 that developers still hit

| Since | Change | What to write |
| --- | --- | --- |
| 15 | `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are async | `const { slug } = await params`; in 16 the synchronous bridge is gone [next/async-params] |
| 16 | `middleware.ts` renamed `proxy.ts` (Node.js runtime only) | export `proxy`; keep `middleware` only if you need the edge runtime |
| 16 | `next lint` removed | `eslint .` with `eslint.config.mjs` and `eslint-config-next` |
| 16 | Turbopack is the default bundler | a custom `webpack` config fails the build; migrate it or pass `--webpack` |
| 16 | `next/image`: `priority` deprecated, `qualities` defaults to `[75]`, `minimumCacheTTL` 4 hours, local `src` with a query string needs `images.localPatterns` | `preload`, or better `loading="eager"` / `fetchPriority="high"` |
| 16 | `revalidateTag(tag)` needs a cache profile | `revalidateTag(tag, 'max')`; `updateTag(tag)` in actions for read-your-writes |
| 16 | parallel route slots need `default.tsx` | return `null` or call `notFound()` |
| 16 | `serverRuntimeConfig`, `publicRuntimeConfig`, AMP removed | environment variables; `connection()` before reading them at request time |
| 16.4 | Cache Components recommended for every app, on in new projects | `cacheComponents: true` in `next.config` |

The `npx @next/codemod@canary upgrade latest` codemod handles most of this; `next-async-request-api` covers the async APIs.

## Server and Client Components

| Need | Where |
| --- | --- |
| Data from a database or an API with a secret | async Server Component or a `server-only` data module |
| State, effects, event handlers, browser APIs | a small `'use client'` component [next/use-client-at-leaves] |
| A context provider | a client component that wraps `{children}` as deep as possible, not `<html>` |
| A third-party component that uses hooks | re-export it from a file that starts with `'use client'` |
| Data for a client component | serializable props, or a promise read with `use()` [next/no-async-client-component] |

Props crossing the boundary must be serializable: plain data, Dates, Maps, promises, JSX and Server Actions, never other functions or class instances.

## Data and caching

| Model | Flag | Cache with | Request data |
| --- | --- | --- | --- |
| Cache Components (16+) | `cacheComponents: true` | `'use cache'` with `cacheLife('hours')` and `cacheTag('posts')` | read `cookies()`, `headers()`, `searchParams` outside the cached function and pass values in; wrap dynamic parts in `<Suspense>` |
| Previous model | flag absent | `fetch(url, { next: { revalidate, tags } })`, route segment config | any runtime API makes the route dynamic |

- Never `fetch('/api/...')` from a Server Component: call the function behind the Route Handler.
- Start independent requests together; await them where they are used.
- Under Cache Components, `Math.random()`, `Date.now()` and `crypto.randomUUID()` need `await connection()` first or a cached scope.

## Server Actions [next/server-action-checks]

1. Authenticate: read the session inside the action; a check in the page or `proxy.ts` does not cover it.
2. Authorize: may this user change this record?
3. Validate every argument with a schema; `FormData` values are strings or files, never trusted types.
4. Mutate through a `server-only` data layer.
5. Revalidate (`revalidatePath`, `revalidateTag`, `updateTag`, `refresh`), then `redirect` outside `try` [next/redirect-outside-try].
6. Return a small result: `{ ok: true }` or field errors for `useActionState`, never a whole row.

Actions run one at a time per client; do not use them to read data or in `Promise.all`.

## Images, fonts, scripts

| Feature | Use |
| --- | --- |
| Local image | `import hero from './hero.jpg'` then `<Image src={hero} alt="…" />` (width, height and blur placeholder come from the import) [next/use-next-image] |
| Remote image | `width`/`height` or `fill`, plus a narrow `images.remotePatterns` entry |
| Responsive slot | `fill` with `sizes="(max-width: 768px) 100vw, 33vw"` and a positioned parent [next/image-fill-sizes] |
| LCP image | `loading="eager"` or `fetchPriority="high"`; `preload` only when one image is always the LCP |
| SVG | `unoptimized` happens automatically; keep `dangerouslyAllowSVG` off |
| Font | `next/font/google` or `next/font/local`, called once, applied with `className` or `variable` [next/use-next-font] |
| Third-party script | `<Script src strategy="afterInteractive">`, `lazyOnload` for chat and widgets; inline scripts need an `id` |

## Metadata and accessibility

- `export const metadata = { title: { default: 'Shop', template: '%s · Shop' }, description }` in the root layout; `generateMetadata` (with `await params`) per dynamic page.
- On client navigation the route announcer reads `document.title`, then the first `<h1>`: give every route a unique title.
- `eslint-config-next` includes `jsx-a11y`; it finds only part of the problems.

## Environment variables [next/public-env-secret]

- `NEXT_PUBLIC_` values are inlined at `next build` and frozen; changing them needs a rebuild. Dynamic lookups (`process.env[name]`) are not inlined.
- Other variables exist only on the server; mark modules that read them with `import 'server-only'`.
- Keep `.env*.local` out of git.

## The @next/next lint rules

`google-font-display`, `google-font-preconnect`, `inline-script-id`, `next-script-for-ga`, `no-assign-module-variable`, `no-async-client-component`, `no-before-interactive-script-outside-document`, `no-css-tags`, `no-document-import-in-page`, `no-duplicate-head`, `no-head-element`, `no-head-import-in-document`, `no-html-link-for-pages`, `no-img-element`, `no-page-custom-font`, `no-script-component-in-head`, `no-styled-jsx-in-document`, `no-sync-scripts`, `no-title-in-document-head`, `no-typos`, `no-unwanted-polyfillio`.

## Sources

- Next.js docs index (version 16.4.6): https://nextjs.org/docs/llms.txt
- Upgrading to version 16: https://nextjs.org/docs/app/guides/upgrading/version-16
- Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Caching: https://nextjs.org/docs/app/getting-started/caching
- Data Security: https://nextjs.org/docs/app/guides/data-security
- Server Actions: https://nextjs.org/docs/app/guides/server-actions
- redirect: https://nextjs.org/docs/app/api-reference/functions/redirect
- Image component: https://nextjs.org/docs/app/api-reference/components/image
- Font module: https://nextjs.org/docs/app/api-reference/components/font
- Script component: https://nextjs.org/docs/app/api-reference/components/script
- Environment variables: https://nextjs.org/docs/app/guides/environment-variables
- ESLint plugin: https://nextjs.org/docs/app/api-reference/config/eslint
- Production checklist: https://nextjs.org/docs/app/guides/production-checklist
