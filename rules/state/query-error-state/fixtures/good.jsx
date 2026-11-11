import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import useSWR from 'swr'
import { fetcher, getTodos, getTags } from './api'

export function Todos() {
  const { data, error, isPending, refetch } = useQuery({ queryKey: ['todos'], queryFn: getTodos })
  const { data: user, error: userError } = useSWR('/api/me', fetcher)
  const { data: tags } = useQuery({ queryKey: ['tags'], queryFn: getTags, throwOnError: true })
  const { data: me } = useSWR('/api/profile', fetcher, { suspense: true })
  const { data: all } = useSuspenseQuery({ queryKey: ['all'], queryFn: getTodos })
  const stats = useQuery({ queryKey: ['stats'], queryFn: getTodos })
  if (isPending) return <p role="status">Loading…</p>
  if (error || userError || stats.error) return <p role="alert">Could not load. <button type="button" onClick={() => refetch()}>Retry</button></p>
  return <ul aria-label={user?.name}>{data.map((t) => <li key={t.id}>{t.title} {tags.length} {me.name} {all.length}</li>)}</ul>
}
