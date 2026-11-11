export function Card({ open, linkProps }: { open: boolean; linkProps: object }) {
  return (
    <div>
      <svg aria-hidden="true"><path d="M0 0" /></svg>
      <div aria-hidden="true" inert>
        <a href="/promo">See the offer</a>
      </div>
      <div aria-hidden="true">
        <a href="/x" tabIndex={-1}>Duplicate link</a>
        <button type="button" disabled>Off</button>
        <a {...linkProps}>Maybe hidden</a>
      </div>
      <div aria-hidden={!open}>
        <button type="button">Close</button>
      </div>
    </div>
  )
}
