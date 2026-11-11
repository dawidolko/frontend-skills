export function Order({ order }) {
  const d = new Date(order.date)
  const date = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
  const price = order.total.toFixed(2) + ' zł'
  const usd = '$' + order.usd.toFixed(2)
  return <p>{date} {price} {usd}</p>
}
