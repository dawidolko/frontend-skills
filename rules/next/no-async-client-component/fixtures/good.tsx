'use client'

import { use } from 'react'

type Item = { id: string; name: string }

export default function Cart({ itemsPromise, onRemove }: { itemsPromise: Promise<Item[]>; onRemove: (id: string) => Promise<void> }) {
  const items = use(itemsPromise)
  async function remove(id: string) {
    await onRemove(id)
  }
  const label = 'async function Fake() {}'
  return <ul data-label={label}>{items.map((item) => <li key={item.id}><button type="button" onClick={() => remove(item.id)}>Remove {item.name}</button></li>)}</ul>
}
