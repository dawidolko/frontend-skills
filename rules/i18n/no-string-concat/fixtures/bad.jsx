export function CartSummary({ count, name }) {
  const title = t('cart.greeting') + ' ' + name
  return <p>{`${t('cart.has')} ${count} ${t('cart.items')}`}</p>
}
