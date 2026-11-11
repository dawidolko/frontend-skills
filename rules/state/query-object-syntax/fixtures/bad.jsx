import { useMutation, useQuery } from '@tanstack/react-query'
import { addTodo, getTodos } from './api'

export function Todos() {
  const todos = useQuery(['todos'], getTodos, { staleTime: 60_000 })
  const add = useMutation((todo) => addTodo(todo))
  return <button type="button" onClick={() => add.mutate({ title: 'New' })}>{todos.data?.length}</button>
}
