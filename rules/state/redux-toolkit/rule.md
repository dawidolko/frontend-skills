---
id: state/redux-toolkit
title: New and maintained Redux code uses Redux Toolkit's configureStore and createSlice, not the legacy createStore.
severity: minor
check: static
applies:
  - jsx
stack:
  - redux
skill: fe-state
since: 0.1.0
sources:
  - title: Redux docs, Why Redux Toolkit is how to use Redux today (source in the reduxjs/redux repository)
    url: https://github.com/reduxjs/redux/blob/master/docs/introduction/why-rtk-is-redux-today.md
  - title: Redux docs, Style guide (source in the reduxjs/redux repository)
    url: https://github.com/reduxjs/redux/blob/master/docs/style-guide/style-guide.md
---

## Why

The Redux maintainers consider the bare `redux` core obsolete for app code. A store built with `createStore` misses the development checks that `configureStore` adds (accidental mutation, values that cannot be serialised), and hand-written action types, action creators and immutable updates are where most Redux bugs live.

## Fix

Replace `createStore(rootReducer)` with `configureStore({ reducer: { … } })` from `@reduxjs/toolkit`, then move reducers to `createSlice` one at a time. Server data belongs in RTK Query or TanStack Query rather than in hand-written thunks and slices.

## Examples

```js
// bad
import { createStore, combineReducers } from 'redux'
export const store = createStore(combineReducers({ todos }))
// good
import { configureStore } from '@reduxjs/toolkit'
export const store = configureStore({ reducer: { todos } })
```
