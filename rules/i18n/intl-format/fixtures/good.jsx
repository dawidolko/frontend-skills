export function Order({ order, locale, d, value }) {
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(order.date))
  const price = new Intl.NumberFormat(locale, { style: 'currency', currency: 'PLN' }).format(order.total)
  const year = d.getFullYear() + 1
  const ratio = (value * 100).toFixed(1) + '%'
  return <p>{date} {price} {year} {ratio}</p>
}
