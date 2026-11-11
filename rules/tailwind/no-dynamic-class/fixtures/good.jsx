const TONE = { red: 'bg-red-600', green: 'bg-green-600' }

export function Badge({ color, variant, open, accent, label }) {
  return (
    <span
      className={`${TONE[color]} rounded px-2 btn-${variant} ${open ? 'block' : 'hidden'}`}
      style={{ '--accent': accent }}
    >
      <b className="bg-(--accent) text-sm">{label}</b>
    </span>
  )
}
