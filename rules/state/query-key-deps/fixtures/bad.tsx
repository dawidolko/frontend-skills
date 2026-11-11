import { useQuery } from '@tanstack/react-query'
import { api } from './api'

export function Todo({ todoId, status }: { todoId: string; status: string }) {
  const todo = useQuery({
    queryKey: ['todo'],
    queryFn: () => api.getTodo(todoId),
  })
  const list = useQuery({
    queryKey: ['todos'],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/todos?status=${status}`, { signal })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      return res.json()
    },
  })
  return <p>{todo.data?.title} {list.data?.length}</p>
}
