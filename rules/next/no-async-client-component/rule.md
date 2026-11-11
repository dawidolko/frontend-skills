---
id: next/no-async-client-component
title: A Client Component is never an async function; fetch in a Server Component parent or read a promise with use().
severity: serious
check: static
applies:
  - jsx
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, No async Client Component
    url: https://nextjs.org/docs/messages/no-async-client-component
  - title: Next.js docs, Server and Client Components
    url: https://nextjs.org/docs/app/getting-started/server-and-client-components
---

## Why

Only Server Components can be `async`. An `async` component in a `'use client'` file returns a promise on every render, which React does not support on the client: the component suspends forever, re-fetches in a loop or throws, depending on how it is reached.

## Fix

Do the `await` in a Server Component and pass the result down as props, or start the request on the server, pass the promise, and read it in the client component with `use(promise)` inside `<Suspense>`. For data that must load in the browser, use a data library (TanStack Query, SWR) or an effect with cleanup.

## Examples

```jsx
// bad
'use client'
export default async function Cart() { const items = await getCart(); return <CartList items={items} /> }
// good
'use client'
export default function Cart({ itemsPromise }) { const items = use(itemsPromise); return <CartList items={items} /> }
```
