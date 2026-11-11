export function PriceList({ items }: { items: any[] }) {
  const total = items.reduce((sum: number, item: any) => sum + item.price, 0)
  const meta = JSON.parse(localStorage.getItem('meta') ?? '{}') as Record<string, any>
  return <p data-meta={meta}>{total}</p>
}
