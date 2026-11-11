---
id: next/use-client-at-leaves
title: Keep App Router pages and layouts Server Components; put 'use client' on the small interactive component they render.
severity: moderate
check: static
applies:
  - jsx
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, Server and Client Components (reducing JS bundle size)
    url: https://nextjs.org/docs/app/getting-started/server-and-client-components
  - title: React docs, 'use client'
    url: https://react.dev/reference/rsc/use-client
---

## Why

`'use client'` marks a boundary: the file and everything it imports go into the browser bundle. On a page or layout that means the whole route's markup, its helpers and its libraries are downloaded and hydrated, data fetching moves to the client, and the file can no longer export `metadata` or `generateMetadata`.

## Fix

Remove `'use client'` from the page or layout. Move the state, effects and handlers into a component of their own (`SearchBox`, `AddToCartButton`) that starts with `'use client'`, and render it from the server page, passing data as serializable props. Server Components passed as `children` to a client component stay on the server.

## Examples

```jsx
// bad: app/products/page.tsx
'use client'
export default function Page() { const [q, setQ] = useState(''); return <main>…</main> }
// good: app/products/page.tsx stays a Server Component
export default async function Page() { const products = await getProducts(); return <main><SearchBox /><List items={products} /></main> }
```
