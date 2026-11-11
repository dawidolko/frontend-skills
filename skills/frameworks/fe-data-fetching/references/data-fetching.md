# Data fetching reference

Depth for the `fe-data-fetching` skill. Latest stable versions on the npm registry, checked 2026-11-11: @tanstack/react-query and @tanstack/vue-query 5.107.1, swr 2.5.1; Next.js 16.4, Nuxt 4.6, SvelteKit 3.2, Angular 22.2. Rule ids in brackets: `frontend-skills explain <id>`.

## Where data comes from

| Stack | Page data | Client-side server state | User actions |
| --- | --- | --- | --- |
| Next.js App Router | `async` Server Components, `fetch` or the database directly | TanStack Query or SWR in Client Components | Server Functions, `useActionState` |
| React Router / Remix | route `loader` | TanStack Query | route `action` |
| Plain React (Vite) | TanStack Query or SWR | same | `useMutation` |
| Nuxt | `useFetch` / `useAsyncData` in setup, with a key | same, or TanStack Vue Query | `$fetch` in handlers |
| Vue (Vite) | TanStack Vue Query | same | `useMutation` |
| SvelteKit | `load` in `+page.js` / `+page.server.js` | TanStack Svelte Query | form actions |
| Angular | resolvers, `httpResource` | `httpResource`, `resource` | `HttpClient` calls (never `httpResource` for writes) |
| Astro | frontmatter `await fetch()` at build or request time | the island's framework library | API routes, Actions |

## TanStack Query

```jsx
// once per app (client component in Next.js)
const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } })) // [state/query-client-stable]

// a query defined once
export const todoOptions = (id) =>
  queryOptions({
    queryKey: ['todos', 'detail', id], // every variable of queryFn [state/query-key-deps]
    queryFn: ({ signal }) => getJson(`/api/todos/${id}`, { signal }), // throws on !res.ok [js/fetch-check-ok]
  })

// a component reads all three states [state/query-error-state]
const { data, error, isPending, refetch } = useQuery(todoOptions(id))

// a mutation invalidates by prefix [state/invalidate-after-mutation]
const save = useMutation({
  mutationFn: updateTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})
```

| Option | Meaning | Typical value |
| --- | --- | --- |
| `staleTime` | How long data counts as fresh (no refetch on mount or focus) | 30 s to 5 min for lists; `Infinity` for static data |
| `gcTime` | How long unused data stays in memory (was `cacheTime` before v5) | default 5 min |
| `enabled` | Wait for a dependency (`enabled: Boolean(userId)`) | dependent queries |
| `placeholderData: keepPreviousData` | Keep the last page while the next loads | pagination |
| `select` | Pick or reshape data for one component | derived views |
| `throwOnError` | Send errors to the nearest error boundary | Suspense layouts |
| `retry` | Retries on failure (3 by default) | `false` for 4xx you raise |

Version 5 notes [state/query-object-syntax]: one object signature only; `isLoading` renamed `isPending` (the new `isLoading` means pending and fetching); `cacheTime` renamed `gcTime`; `useSuspenseQuery` for Suspense instead of a `suspense` option.

Keys: arrays at the top level, general to specific (`['todos', 'list', { status, page }]`). Objects in keys are hashed deterministically, so property order does not matter. In Vue, pass refs or getters in the key, not `.value`.

## SWR

```jsx
const fetcher = (url) => getJson(url)
const { data, error, isLoading, mutate } = useSWR(userId ? `/api/users/${userId}` : null, fetcher)
```

A `null` key pauses the request (dependent data). The fetcher must throw on non-2xx responses, or `error` stays empty. After a change, call `mutate(key)` or the bound `mutate()`.

## Effects without a library [state/fetch-effect-cleanup]

```jsx
useEffect(() => {
  const controller = new AbortController()
  getJson(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
    .then(setResults)
    .catch((err) => { if (err.name !== 'AbortError') setError(err) })
  return () => controller.abort()
}, [query])
```

Vue: `watch(query, async (q, _old, onCleanup) => { … })` with `onCleanup` (or `onWatcherCleanup()` in Vue 3.5) to abort. Svelte: `$effect` returning a cleanup function.

## Server rendering and hydration

- Prefetch on the server, then hydrate: `await queryClient.prefetchQuery(todoOptions(id))` and pass `dehydrate(queryClient)` to `HydrationBoundary` (Next.js App Router), so the client does not refetch at once (set `staleTime` above 0).
- On a server, create a `QueryClient` per request; a module-level client shares one cache between users.
- Nuxt `useFetch` and `useAsyncData` send their result in the payload; a bare `$fetch` in setup runs twice (server and client).

## Loading and error UI

| State | Show | Accessibility |
| --- | --- | --- |
| Pending, first load | Skeleton of the final size, or a short text | `role="status"` or `aria-busy="true"` on the region |
| Refetching with data | Keep the data; a small indicator | no announcement needed |
| Error | What failed, in plain words, and a Retry button calling `refetch()` | `role="alert"` |
| Empty | A message that says nothing matched, and what to do | – |

## Not checked automatically

Query code in `.ts` files (the audit reads `.js`, `.jsx`, `.tsx`, `.vue`, `.svelte` and `.astro`), whether every mutation invalidates the right keys, `staleTime` choices and waterfalls between components: review those by hand.

## Sources

- TanStack Query, Overview: https://tanstack.com/query/latest/docs/framework/react/overview
- TanStack Query, Queries: https://tanstack.com/query/latest/docs/framework/react/guides/queries
- TanStack Query, Query Keys: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- TanStack Query, Query Functions: https://tanstack.com/query/latest/docs/framework/react/guides/query-functions
- TanStack Query, Invalidations from Mutations: https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
- TanStack Query, Server Rendering and Hydration: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
- TanStack Query, Migrating to v5: https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5
- TanStack Query, ESLint exhaustive-deps: https://tanstack.com/query/latest/docs/eslint/exhaustive-deps
- TanStack Vue Query, Query Keys: https://tanstack.com/query/latest/docs/framework/vue/guides/query-keys
- SWR, Getting Started: https://swr.vercel.app/docs/getting-started
- SWR, Error Handling: https://swr.vercel.app/docs/error-handling
- SWR, Mutation and Revalidation: https://swr.vercel.app/docs/mutation
- React, You Might Not Need an Effect: https://react.dev/learn/you-might-not-need-an-effect
- Next.js, Fetching Data: https://nextjs.org/docs/app/getting-started/fetching-data
- Nuxt, Data Fetching: https://nuxt.com/docs/4.x/getting-started/data-fetching
- SvelteKit, Loading data: https://svelte.dev/docs/kit/load
- Angular, httpResource: https://angular.dev/guide/http/http-resource
