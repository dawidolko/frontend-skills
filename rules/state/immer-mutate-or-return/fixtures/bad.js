import { createSlice } from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], filter: 'all' },
  reducers: {
    todoAdded: (state, action) => state.items.push(action.payload),
    filterChanged: (state, { payload }) => (state.filter = payload),
    sorted: state => state.items.sort((a, b) => a.title.localeCompare(b.title))
  }
})

export const { todoAdded, filterChanged, sorted } = todosSlice.actions
export default todosSlice.reducer
