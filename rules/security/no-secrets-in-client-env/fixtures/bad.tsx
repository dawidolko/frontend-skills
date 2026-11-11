export async function charge(amount: number) {
  const res = await fetch('https://api.example-pay.com/charges', {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}` },
    body: JSON.stringify({ amount })
  })
  const db = import.meta.env.VITE_DB_PASSWORD
  return res.json()
}
