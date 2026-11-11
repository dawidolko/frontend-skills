import { createSlice } from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], filter: 'all' },
  reducers: {
    todoAdded: (state, action) => {
      state.items.push(action.payload)
    },
    filterChanged: (state, { payload }) => void (state.filter = payload),
    todoRemoved: (state, action) => ({ ...state, items: state.items.filter((t) => t.id !== action.payload) }),
    cleared: () => ({ items: [], filter: 'all' }),
    isEmpty: (state) => state.items.length === 0
  }
})

export const { todoAdded, filterChanged, todoRemoved, cleared } = todosSlice.actions
export default todosSlice.reducer
