---
id: react/no-derived-state-effect
title: Values computed from props or state are calculated during render, not copied into state by an effect.
severity: moderate
check: manual
applies:
  - jsx
stack:
  - react
  - next
skill: fe-react
since: 0.1.0
sources:
  - title: React docs, You Might Not Need an Effect
    url: https://react.dev/learn/you-might-not-need-an-effect
---

## Why

`useEffect(() => setFullName(first + ' ' + last), [first, last])` renders once with a stale value, then again with the right one: an extra render, a flash of wrong content and a second source of truth that drifts.

## Fix

Compute it in the component body: `const fullName = first + ' ' + last`. If the computation is expensive, wrap it in `useMemo` (or let React Compiler memoize it). Reset state on a prop change with a `key`, and handle user events in the event handler, not in an effect.

## Examples

```jsx
// bad
const [visible, setVisible] = useState([])
useEffect(() => setVisible(todos.filter((t) => !t.done)), [todos])
// good
const visible = todos.filter((t) => !t.done)
```
