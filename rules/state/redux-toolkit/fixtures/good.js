// import { createStore } from 'redux' was the old setup
import { configureStore } from '@reduxjs/toolkit'
import { createStore } from 'zustand/vanilla'
import todos from './todos'

export const store = configureStore({ reducer: { todos } })
export const uiStore = createStore(() => ({ sidebarOpen: false }))
