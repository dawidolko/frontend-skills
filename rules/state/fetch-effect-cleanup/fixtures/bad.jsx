import { useEffect, useState } from 'react'
import axios from 'axios'

export function SearchResults({ query }) {
  const [results, setResults] = useState([])
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then((r) => {
        return r.json()
      })
      .then(setResults)
  }, [query])
  useEffect(() => {
    axios.get('/api/me').then((res) => setUser(res.data))
  }, [])
  return <p>{results.length} {user?.name}</p>
}
