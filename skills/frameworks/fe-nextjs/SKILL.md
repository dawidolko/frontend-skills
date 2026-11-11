---
name: fe-nextjs
description: Writes and reviews Next.js 16 App Router code - Server and Client Components, async params, Server Actions, caching, metadata, next/image, next/font and environment variables - so routes stay fast, safe and correct. Use when editing app/ routes, layouts, actions or next.config, upgrading from Next.js 15, or asked to review a Next.js change.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Next.js App Router
  area: frameworks
  lane: B
  requires: next
  globs: "**/*.tsx **/*.jsx app/**/*.js app/**/*.ts src/app/**/*.js src/app/**/*.ts next.config.* proxy.* middleware.*"
  rules: "next/use-client-at-leaves next/no-async-client-component next/async-params next/redirect-outside-try next/server-action-checks next/public-env-secret next/use-next-image next/image-fill-sizes next/use-next-font"
  version: 0.1.0
---

# Next.js App Router

Read `.frontend-skills/profile.json` (Next.js version, `cacheComponents`, router) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill. Also follow `fe-react`.

## Rules

- Pages and layouts stay Server Components; `'use client'` goes on the small interactive leaf (next/use-client-at-leaves).
- A Client Component is never `async`; await on the server or read a promise with `use()` (next/no-async-client-component).
- `await params` and `await searchParams`; Next.js 16 removed synchronous access (next/async-params).
- Call `redirect()` and `notFound()` after the `try`/`catch`, never inside it (next/redirect-outside-try).
- Every Server Action authenticates, authorizes, validates input and returns only what the UI needs (next/server-action-checks).
- Secrets never get the `NEXT_PUBLIC_` prefix; server-only modules start with `import 'server-only'` (next/public-env-secret).
- Images through `next/image` (next/use-next-image); with `fill`, always set `sizes` (next/image-fill-sizes).
- Fonts through `next/font`, never a `<link>` to Google Fonts (next/use-next-font).
- Titles and descriptions through `metadata` or `generateMetadata`; each route has a unique title.
- Never fetch your own Route Handlers from a Server Component; call the data function directly.

## Do this

1. Find the router: `app/` (App Router) or `pages/` (Pages Router); these rules are for `app/`. Read `next.config.*` for `cacheComponents`, `reactCompiler`, `images` and `basePath`.
2. Fetch in async Server Components close to where data is used; start independent requests together (`Promise.all`) and wrap slow parts in `<Suspense>` or a `loading.tsx`.
3. With `cacheComponents: true`, cache with `'use cache'` plus `cacheLife`/`cacheTag`; read `cookies()`, `headers()` and `searchParams` outside the cached scope. Without it, follow the previous model (`fetch` options, `revalidate`). Do not mix the two.
4. Mutate with Server Actions (`<form action={action}>`, `useActionState`), then `revalidatePath`, `revalidateTag(tag, 'max')` or `updateTag`, then `redirect`.
5. For the LCP image use `loading="eager"` or `fetchPriority="high"` (the `priority` prop is deprecated in 16); for third-party scripts use `next/script` with `afterInteractive` or `lazyOnload`.
6. Add `error.tsx`, `not-found.tsx` and `global-error.tsx` with a way back; set `lang` on `<html>` in the root layout.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports client pages, async client components, sync params, redirects in `try`, public secrets, `<img>`, `fill` without `sizes` and Google Fonts links.
- Run ESLint with `eslint-config-next/core-web-vitals` (and `/typescript`); `next lint` is gone in 16. Run `next build`: it reports Cache Components errors.
- Review every new `'use server'` function by hand against next/server-action-checks.

## References

- [references/nextjs.md](references/nextjs.md): what changed in 15 and 16, the two caching models, Server Action checklist, image and font props, the `@next/next` lint rules. Read it before an upgrade, a caching change or a new action.
