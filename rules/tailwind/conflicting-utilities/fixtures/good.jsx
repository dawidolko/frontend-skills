export function Panel({ open, children }) {
  return (
    <section className="grid gap-2 md:flex">
      <div className="rounded-lg px-2 py-4 pt-6 hover:p-6">{children}</div>
      <div className={open ? 'block' : 'hidden'}>{children}</div>
      <div className="-mt-2 mb-4 ml-auto w-full max-w-prose text-sm font-bold">{children}</div>
      <div className="p-(--pad) p-4">{children}</div>
    </section>
  )
}
