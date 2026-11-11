---
id: react/no-array-index-key
title: A list item's key comes from the data (an id), not from the array index.
severity: moderate
check: static
applies:
  - jsx
stack:
  - react
  - next
  - preact
skill: fe-react
since: 0.1.0
sources:
  - title: React docs, Rendering lists (rules of keys)
    url: https://react.dev/learn/rendering-lists#rules-of-keys
  - title: React docs, Preserving and resetting state
    url: https://react.dev/learn/preserving-and-resetting-state
---

## Why

React matches list items between renders by key. With the index as key, inserting, removing or sorting items gives each component the state of its neighbour: typed text, checked boxes and focus move to the wrong row.

## Fix

Use a stable id from the data: `key={todo.id}`. If the data has none, create ids when the data is created (`crypto.randomUUID()`), not during render. The index is acceptable only for a static list that never reorders and holds no state.

## Examples

```jsx
// bad
{todos.map((todo, index) => <Todo key={index} todo={todo} />)}
// good
{todos.map((todo) => <Todo key={todo.id} todo={todo} />)}
```
