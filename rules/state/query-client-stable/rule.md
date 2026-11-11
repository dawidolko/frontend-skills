---
id: state/query-client-stable
title: The QueryClient is created once - in useState(() => new QueryClient()) or a module helper - never in a component's render.
severity: serious
check: static
applies:
  - jsx
stack:
  - tanstack-query
skill: fe-data-fetching
since: 0.1.0
sources:
  - title: TanStack Query docs, Server Rendering and Hydration (create the QueryClient inside the app, in React state)
    url: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
---

## Why

`const queryClient = new QueryClient()` in a component body builds a new, empty cache on every render: every query refetches, loading spinners flash, and a refetch that re-renders the provider can loop. A client at module level is the opposite problem on a server: one cache shared by every request, leaking one user's data to the next.

## Fix

In a component, create it once: `const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }))`. In a framework with server rendering, use a `getQueryClient()` helper that makes a new client per request on the server and reuses one in the browser. A plain client-only app may keep one module-level client.

## Examples

```jsx
// bad
export function Providers({ children }) {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
// good
export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```
