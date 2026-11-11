---
id: state/immer-mutate-or-return
title: A Redux Toolkit or Immer reducer either mutates the draft or returns a new state, never both; no arrow that returns a mutation.
severity: serious
check: static
applies:
  - jsx
stack:
  - redux
skill: fe-state
since: 0.1.0
sources:
  - title: Redux Toolkit docs, Writing reducers with Immer (source in the reduxjs/redux-toolkit repository)
    url: https://github.com/reduxjs/redux-toolkit/blob/master/docs/usage/immer-reducers.md
---

## Why

Inside `createSlice` and `createReducer`, Immer lets a reducer "mutate" a draft. It also accepts a returned new state, but not both at once. An arrow with an expression body, such as `(state, action) => state.push(action.payload)`, mutates the draft and returns the array length, and Immer throws when the action is dispatched.

## Fix

Give the arrow a block body (`(state, action) => { state.push(action.payload) }`), or put `void` before the mutation. To replace the state instead, return a new value and leave the draft alone: `(state, action) => state.filter((t) => t.id !== action.payload)`.

## Examples

```js
// bad
todoAdded: (state, action) => state.push(action.payload),
// good
todoAdded: (state, action) => {
  state.push(action.payload)
},
todoRemoved: (state, action) => state.filter((t) => t.id !== action.payload),
```
