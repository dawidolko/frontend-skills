---
id: state/selector-stable-result
title: A store selector returns existing values, not a new object or array on every call; pick fields one by one or use useShallow or shallowEqual.
severity: serious
check: static
applies:
  - jsx
stack:
  - zustand
  - redux
skill: fe-state
since: 0.1.0
sources:
  - title: Zustand docs, Migrating to v5 (source in the pmndrs/zustand repository)
    url: https://github.com/pmndrs/zustand/blob/main/docs/reference/migrations/migrating-to-v5.md
  - title: Zustand docs, useShallow (source in the pmndrs/zustand repository)
    url: https://github.com/pmndrs/zustand/blob/main/docs/reference/hooks/use-shallow.md
  - title: React Redux docs, Hooks (useSelector equality; source in the reduxjs/react-redux repository)
    url: https://github.com/reduxjs/react-redux/blob/master/docs/api/hooks.md
---

## Why

A selector such as `(s) => ({ count: s.count, user: s.user })` builds a new object each time it runs, so the store sees a "changed" result on every update. With React Redux the component re-renders after every dispatched action, wherever it happened. With Zustand 5, which compares with `Object.is`, the same selector can loop until React stops with "Maximum update depth exceeded".

## Fix

Select one value per call (`const count = useStore((s) => s.count)`), or wrap a multi-value selector in `useShallow` (Zustand) or pass `shallowEqual` (React Redux). A derived list (`s.todos.filter(...)`) belongs in a memoized selector (`createSelector`) or is computed in the component from the raw slice.

## Examples

```jsx
// bad
const { count, inc } = useCounterStore((s) => ({ count: s.count, inc: s.inc }))
const done = useSelector((state) => state.todos.filter((t) => t.done))
// good
const [count, inc] = useCounterStore(useShallow((s) => [s.count, s.inc]))
const todos = useSelector((state) => state.todos)
const done = todos.filter((t) => t.done)
```
