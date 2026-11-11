---
id: state/invalidate-after-mutation
title: After a mutation succeeds, invalidate or update every cached query it changed, so lists and details show the new data.
severity: moderate
check: manual
applies:
  - jsx
  - vue
  - svelte
  - angular
stack:
  - tanstack-query
  - swr
skill: fe-data-fetching
since: 0.1.0
sources:
  - title: TanStack Query docs, Invalidations from Mutations
    url: https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
  - title: SWR docs, Mutation and revalidation (source in the vercel/swr-site repository)
    url: https://github.com/vercel/swr-site/blob/main/content/docs/mutation.mdx
---

## Why

A cache does not know that the server changed. After "Add todo" succeeds, the list query still holds the old array until something refetches it, so the person sees their action "not work" and clicks again, creating a duplicate.

## Fix

In `onSuccess` (or `onSettled`), call `queryClient.invalidateQueries({ queryKey: ['todos'] })` with a key prefix that covers every affected list and detail; or write the returned entity into the cache with `setQueryData` when the response holds it. With SWR, call `mutate(key)`. For instant feedback, use an optimistic update with a rollback in `onError`. Review every mutation for the queries it touches; key factories make the prefixes easy to find.

## Examples

```js
// bad
const add = useMutation({ mutationFn: addTodo })
// good
const add = useMutation({
  mutationFn: addTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})
```
