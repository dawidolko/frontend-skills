import { useQuery } from '@tanstack/react-query'
import useSWR from 'swr'
import { fetcher, getTodos } from './api'

export function Todos() {
  const { data } = useQuery({ queryKey: ['todos'], queryFn: getTodos })
  const { data: user, isLoading } = useSWR('/api/me', fetcher)
  if (isLoading) return <p role="status">Loading…</p>
  return <ul aria-label={user?.name}>{data?.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
}
