export async function charge(amount: number) {
  // the secret key lives on the server; NEXT_PUBLIC_STRIPE_SECRET_KEY was removed
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const res = await fetch('/api/charges', { method: 'POST', body: JSON.stringify({ amount, publishable }) })
  return res.json()
}
