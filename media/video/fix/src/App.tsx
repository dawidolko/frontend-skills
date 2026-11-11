import { useState } from 'react'
import hero from './hero.jpg'
import './app.css'

export function App({ items }: { items: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <main className="min-h-dvh">
      <img src={hero} alt="Our team at the spring meetup" width={1200} height={600} />
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        Menu
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" autoComplete="email" />
      <button type="submit" className="outline-none focus-visible:ring-2">Send</button>
    </main>
  )
}
