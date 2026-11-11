export function Badge({ color, size, label }) {
  return (
    <span className={`bg-${color}-600 rounded px-2`}>
      <b className={'text-' + size}>{label}</b>
    </span>
  )
}
