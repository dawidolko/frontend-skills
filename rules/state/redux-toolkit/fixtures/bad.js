import { createStore, combineReducers } from 'redux'
import todos from './todos'

export const store = createStore(combineReducers({ todos }))
