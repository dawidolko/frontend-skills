---
id: state/server-state-cache
title: Server data comes from the framework loader or a server-state library, not fetch plus useState and loading flags in each component.
severity: moderate
check: manual
applies:
  - jsx
  - vue
  - svelte
  - angular
skill: fe-data-fetching
since: 0.1.0
sources:
  - title: React docs, You Might Not Need an Effect (fetching data)
    url: https://react.dev/learn/you-might-not-need-an-effect
  - title: Next.js docs, Fetching Data
    url: https://nextjs.org/docs/app/getting-started/fetching-data
  - title: Nuxt docs, Data Fetching
    url: https://nuxt.com/docs/4.x/getting-started/data-fetching
  - title: SvelteKit docs, Loading data
    url: https://svelte.dev/docs/kit/load
  - title: Angular docs, Reactive data fetching with httpResource
    url: https://angular.dev/guide/http/http-resource
---

## Why

Each hand-written `fetch` + `useState` + `isLoading` block re-implements caching, deduplication, race handling, retries and refetching, usually only partly. Two components that need the same data request it twice, the page renders a spinner where server rendering could have sent the content, and requests run one after another (waterfalls).

## Fix

Use what the stack provides: Server Components or route loaders (Next.js, React Router), `load` (SvelteKit), `useFetch`/`useAsyncData` (Nuxt), `httpResource` or resolvers (Angular); in a client-only app, TanStack Query, SWR or RTK Query. Start independent requests together. Keep a raw `fetch` for event handlers (submitting a form) and for code outside components.

## Examples

```jsx
// bad: every page repeats this
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)
useEffect(() => { getUser(id).then(setUser).finally(() => setLoading(false)) }, [id])
// good
const { data: user, error, isPending } = useQuery({ queryKey: ['user', id], queryFn: () => getUser(id) })
```
