'use client'

import { useState } from 'react'

// A leaf client component; the page that renders it stays on the server.
export default function SearchBox({ placeholder }: { placeholder: string }) {
  const [query, setQuery] = useState('')
  return <input aria-label="Search products" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
}
