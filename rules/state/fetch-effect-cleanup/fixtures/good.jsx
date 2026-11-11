import { useEffect, useState } from 'react'
import { getJson } from './api'

export function SearchResults({ query, onError }) {
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [online, setOnline] = useState(true)
  useEffect(() => {
    let ignore = false
    fetch(`/api/search?q=${query}&page=${page}`)
      .then((r) => r.json())
      .then((json) => {
        if (!ignore) setResults(json)
      })
    return () => {
      ignore = true
    }
  }, [query, page])
  useEffect(() => {
    const controller = new AbortController()
    getJson(`/api/search?q=${query}`, { signal: controller.signal }).then(setResults, onError)
    return () => controller.abort()
  }, [query, onError])
  useEffect(() => {
    fetch('/api/log', { method: 'POST', body: query })
  }, [query])
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    return () => window.removeEventListener('online', update)
  }, [])
  return <button type="button" onClick={() => setPage(page + 1)}>{results.length} {String(online)}</button>
}
