---
id: react/no-nested-component
title: Components are declared at module level, never inside another component's body.
severity: serious
check: manual
applies:
  - jsx
stack:
  - react
  - next
skill: fe-react
since: 0.1.0
sources:
  - title: React docs, Preserving and resetting state (different components at the same position)
    url: https://react.dev/learn/preserving-and-resetting-state
---

## Why

A component defined inside another is a new function on every render, so React sees a different component type each time: it unmounts and remounts it, losing its state, its input focus and its DOM, and it costs a full re-render of that subtree.

## Fix

Move the inner component to the top level of the module and pass what it needs as props. For a small piece of markup that needs the outer scope, render it inline or with a plain function call that returns JSX, not as `<Inner />`.

## Examples

```jsx
// bad
function List({ items }) {
  function Row({ item }) { return <li>{item.name}</li> }
  return <ul>{items.map((i) => <Row key={i.id} item={i} />)}</ul>
}
// good
function Row({ item }) { return <li>{item.name}</li> }
function List({ items }) {
  return <ul>{items.map((i) => <Row key={i.id} item={i} />)}</ul>
}
```
