import { useMutation, useQuery } from '@tanstack/react-query'
import { addTodo, todosOptions } from './api'

export function Todos({ filter }) {
  const todos = useQuery({ queryKey: ['todos', filter], queryFn: () => getTodos(filter), staleTime: 60_000 })
  const shared = useQuery(todosOptions(filter))
  const fromVar = useQuery(options)
  const add = useMutation({ mutationFn: (todo) => addTodo(todo) })
  return <button type="button" onClick={() => add.mutate({ title: 'New' })}>{todos.data?.length} {shared.data?.length} {fromVar.data}</button>
}
