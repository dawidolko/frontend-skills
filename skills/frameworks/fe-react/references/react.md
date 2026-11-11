# React reference

Depth for the `fe-react` skill, for React 19 (latest stable checked 2026-11-11 on the npm registry: 19.3). Rule ids in brackets: `frontend-skills explain <id>`.

## Effects: when you do not need one

| You want to | Do this instead of an effect |
| --- | --- |
| Compute a value from props or state | Compute it during render; `useMemo` if it is expensive [react/no-derived-state-effect] |
| Reset state when a prop changes | Give the component `key={prop}` |
| Adjust part of the state on a prop change | Store the previous prop and compare during render, or restructure state |
| Respond to a click or a submit | Put the logic in the event handler |
| Notify a parent of a change | Call the parent's callback in the same event handler |
| Fetch data for the page | The framework's data API, or a data library |

An effect is right for: subscribing to a browser API or a store (prefer `useSyncExternalStore`), connecting to a socket, controlling a non-React widget, measuring layout (`useLayoutEffect`). Always clean up:

```jsx
useEffect(() => {
  const controller = new AbortController()
  fetch(`/api/users/${id}`, { signal: controller.signal }).then(…)
  return () => controller.abort()
}, [id])
```

## State structure

- Group values that change together; avoid two states that must stay in sync.
- Store ids, not copies of objects that also live in a list.
- No state for what can be derived; no props copied into state (except as an explicit initial value named `initialX`).
- Many related updates: `useReducer`. Shared across distant components: context for rarely changing values, a store (Zustand, Redux Toolkit, Jotai) for frequently changing ones.

## Keys and identity

- Keys are stable, unique among siblings and come from the data [react/no-array-index-key].
- A component's identity is its type and position: defining a component inside another creates a new type each render [react/no-nested-component].
- Changing `key` deliberately resets a subtree (a form for a different user).

## React 19 APIs

| API | Use |
| --- | --- |
| `<form action={fn}>` and `useActionState` | Submit with pending and error state, works before hydration with a server function |
| `useFormStatus` | Pending state inside a form's child, such as a submit button |
| `useOptimistic` | Show the expected result while an action runs |
| `use(promise)` / `use(context)` | Read a promise inside Suspense; read context conditionally |
| `ref` as a prop | Function components take `ref` directly; `forwardRef` is no longer needed |
| `<title>`, `<meta>`, `<link>` in components | Hoisted to the document head |

## Memoization and React Compiler

React Compiler 1.0 has been stable since 2025-10-07 and works with React 17 and later (https://react.dev/blog/2025/10/07/react-compiler-1). With it enabled, components and hooks are memoized automatically; hand-written `useMemo`, `useCallback` and `memo` are mostly unnecessary. It relies on the rules of React: pure render, no mutation of props or state, hooks at the top level.

Without the compiler: measure first (React DevTools Profiler), then `memo` a child that re-renders often with equal props, `useCallback` for handlers passed to it, `useMemo` for expensive calculations.

## Performance and accessibility notes

- Lazy-load routes and heavy widgets with `lazy()` and `<Suspense>`.
- Long lists: virtualise (TanStack Virtual) past a few hundred rows.
- Use `useId()` for label and description ids; never `Math.random()` ids, which differ between server and client.
- Move focus deliberately after route changes and when opening dialogs (`<dialog>` with `showModal()` traps focus natively).

## Next.js notes

- Server Components are the default in the App Router; add `"use client"` only to the components that need state, effects or browser APIs, as low in the tree as possible.
- Images through `next/image` with `width`/`height` or `fill` and `sizes`; fonts through `next/font`.
- Set `lang` on `<html>` in `app/layout.tsx`; titles through the `metadata` export.

## Sources

- React docs: https://react.dev/learn
- You Might Not Need an Effect: https://react.dev/learn/you-might-not-need-an-effect
- React 19 release: https://react.dev/blog/2024/12/05/react-19
- Rules of React: https://react.dev/reference/rules
