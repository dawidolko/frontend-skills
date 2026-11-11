export function Panel({ children }) {
  return (
    <section className="flex grid gap-2">
      <div className="rounded p-2 p-4">{children}</div>
    </section>
  )
}
