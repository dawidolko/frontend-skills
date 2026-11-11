'use client'

import { getCart } from '@/lib/cart'

export default async function Cart() {
  const items = await getCart()
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
}

export const CartCount = async () => <span>{(await getCart()).length}</span>
