export function CartSummary({ count, name, index }) {
  // t('cart.has') + count was replaced by one message
  const title = t('cart.greeting', { name })
  const id = 'row-' + index
  return <p id={id} title={title}>{t('cart.items', { count })}</p>
}
