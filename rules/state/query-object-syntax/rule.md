---
id: state/query-object-syntax
title: TanStack Query 5 hooks take one options object; the v4 positional form useQuery(key, fn) and useMutation(fn) no longer works.
severity: serious
check: static
applies:
  - jsx
  - vue
  - svelte
stack:
  - tanstack-query
skill: fe-data-fetching
since: 0.1.0
sources:
  - title: TanStack Query docs, Migrating to TanStack Query v5 (supports a single signature, one object)
    url: https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5
---

## Why

Version 5 removed the overloads that took the key, the function and the options as separate arguments. Code copied from older tutorials, or written from memory by an agent, fails type checking or throws at run time after an upgrade.

## Fix

Pass one object: `useQuery({ queryKey: ['todos'], queryFn: getTodos })`, `useMutation({ mutationFn: addTodo })`. While upgrading, also rename `cacheTime` to `gcTime` and `isLoading` (first load) to `isPending`.

## Examples

```js
// bad
useQuery(['todos'], getTodos, { staleTime: 60_000 })
useMutation((todo) => addTodo(todo))
// good
useQuery({ queryKey: ['todos'], queryFn: getTodos, staleTime: 60_000 })
useMutation({ mutationFn: addTodo })
```
