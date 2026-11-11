import { useState } from 'react'
import './app.css'

export function App({ items }: { items: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <main className="min-h-screen">
      <img src="/hero.jpg" />
      <div onClick={() => setOpen(!open)}>Menu</div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
      <input type="email" placeholder="Email" />
      <button className="outline-none">Send</button>
    </main>
  )
}
