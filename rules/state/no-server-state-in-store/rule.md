---
id: state/no-server-state-in-store
title: Data fetched from a server lives in the framework's loader or a server-state cache, not copied into a client store.
severity: moderate
check: manual
applies:
  - jsx
  - vue
  - svelte
skill: fe-state
since: 0.1.0
sources:
  - title: TanStack Query docs, Does TanStack Query replace Redux, MobX or other global state managers?
    url: https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state
  - title: SvelteKit docs, State management (no side effects in load)
    url: https://svelte.dev/docs/kit/state-management
---

## Why

A store that holds a copy of server data (users, products, the cart from the API) needs its own loading and error flags, refetching, invalidation after every change and cleanup on logout. Each copy drifts from the server and from the other copies; during server rendering a module-level store can even show one user's data to another.

## Fix

Read server data through the framework (Server Components, `load`, `useFetch`/`useAsyncData`, route resolvers) or a server-state library (TanStack Query, SWR, RTK Query, Angular `httpResource`). Keep only client state in stores: theme, open panels, a draft, the selected tab. After a mutation, invalidate or update the cached query instead of patching a store.

## Examples

```js
// bad: a Zustand store that fetches and caches the product list
const useProducts = create((set) => ({ list: [], load: async () => set({ list: await getProducts() }) }))
// good: server state in a query, client state in the store
const products = useQuery({ queryKey: ['products'], queryFn: getProducts })
const useUi = create((set) => ({ cartOpen: false, toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })) }))
```
