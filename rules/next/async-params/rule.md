---
id: next/async-params
title: Await params and searchParams in App Router pages, layouts and generateMetadata; Next.js 16 removed synchronous access.
severity: serious
check: static
applies:
  - jsx
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, Upgrading to version 16 (Async Request APIs, breaking change)
    url: https://nextjs.org/docs/app/guides/upgrading/version-16
  - title: Next.js docs, page.js (params and searchParams props)
    url: https://nextjs.org/docs/app/api-reference/file-conventions/page
---

## Why

Since Next.js 15 the `params` and `searchParams` props are promises; 15 still allowed reading them directly as a temporary bridge, and 16 removed it. Code such as `params.slug` now reads a property of a promise: it is `undefined`, the page renders the wrong item or a 404, and TypeScript only catches it when the props are typed as promises.

## Fix

`const { slug } = await params` in an async Server Component (and in `generateMetadata`); in a Client Component page, `const { slug } = use(params)`. Type the props with the generated helpers (`PageProps<'/blog/[slug]'>`, `LayoutProps`) from `npx next typegen`, or run the `next-async-request-api` codemod. `generateImageMetadata` and `generateStaticParams` keep synchronous values.

## Examples

```tsx
// bad
export default function Page({ params }) { return <Post slug={params.slug} /> }
// good
export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  return <Post slug={slug} />
}
```
