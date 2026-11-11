---
name: fe-react
description: Writes and reviews React 19 components (also inside Next.js, Vite or React Router apps) - keys, state, effects, events, refs, forms with actions, memoization and React Compiler - so they stay correct, accessible and fast. Use when creating or editing a .jsx or .tsx component or hook, fixing a re-render or stale-state bug, or when asked "review this React code".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: React components
  area: frameworks
  lane: B
  requires: react
  globs: "**/*.jsx **/*.tsx"
  rules: "react/no-array-index-key react/no-derived-state-effect react/no-nested-component a11y/no-click-on-static a11y/img-alt"
  version: 0.1.0
---

# React components

Read `.frontend-skills/profile.json` (React version, framework, state and data libraries) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Keys come from the data (`key={item.id}`), never the array index for lists that change (react/no-array-index-key).
- Compute derived values during render; an effect only synchronises with something outside React (react/no-derived-state-effect).
- Declare components at module level; never define a component inside another (react/no-nested-component).
- Keep state minimal and close to where it is used; lift it only as far as the nearest shared parent.
- Handle user actions in event handlers, not in effects that watch state.
- Every effect that subscribes, listens or starts a timer returns a cleanup.
- Interactive elements are `<button>` and `<a>`, not `div` with `onClick` (a11y/no-click-on-static); every `<img>` has `alt` (a11y/img-alt).
- Never mutate state or props; never call hooks conditionally; never read `ref.current` during render.

## Do this

1. Check the profile for the React version: on React 19 use `use`, form actions (`<form action={fn}>`, `useActionState`, `useFormStatus`), `ref` as a prop (no `forwardRef`) and `<title>`/`<meta>` in components.
2. If React Compiler is enabled (`babel-plugin-react-compiler` or the framework option), do not add `useMemo`, `useCallback` or `memo` by hand for render speed; write plain code that follows the rules of React.
3. Without the compiler, memoize only what a profiler shows to be slow, or values passed to memoized children and effect dependencies.
4. Fetch data with the framework (Server Components, loaders) or a data library (TanStack Query, SWR); a raw fetch in `useEffect` needs a cleanup flag against race conditions.
5. Split a component when it has two reasons to change; keep files to one exported component plus small private helpers.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports index keys, clickable `div`s and missing `alt`.
- Run the project's lint with `eslint-plugin-react-hooks` (rules of hooks, exhaustive deps); never silence it to pass.
- Watch the React DevTools Profiler for components that re-render with unchanged props.

## References

- [references/react.md](references/react.md): effects and when not to use them, state structure, React 19 APIs, compiler and memoization, data fetching and Next.js notes. Read it for a new feature, a hook, or a performance problem.
