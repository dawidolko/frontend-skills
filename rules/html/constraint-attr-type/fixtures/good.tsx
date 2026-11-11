export function Fields({ kind }: { kind: string }) {
  return (
    <>
      <label htmlFor="qty">Quantity</label>
      <input id="qty" type="number" min={1} max={99} step={1} />
      <label htmlFor="code">Code</label>
      <input id="code" type="text" inputMode="numeric" pattern="[0-9]{4}" minLength={4} maxLength={4} />
      <label htmlFor="when">Date</label>
      <input id="when" type="date" min="2026-01-01" />
      <label htmlFor="name">Name</label>
      <input id="name" maxLength={80} />
      <label htmlFor="x">Value</label>
      <input id="x" type={kind} min="1" />
      <textarea aria-label="Notes" maxLength={500}></textarea>
    </>
  )
}
