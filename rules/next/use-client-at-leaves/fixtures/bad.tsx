'use client'

import { useState } from 'react'

export default function Page() {
  const [query, setQuery] = useState('')
  return (
    <main>
      <h1>Products</h1>
      <input aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
    </main>
  )
}
