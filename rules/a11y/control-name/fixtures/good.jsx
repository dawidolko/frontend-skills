export function Toolbar({ onClose, label, buttonProps, children }) {
  return (
    <div>
      <button type="button" onClick={onClose} aria-label="Close">
        <XIcon aria-hidden="true" />
      </button>
      <button type="button">
        <XIcon aria-hidden="true" />
        <span className="sr-only">Close</span>
      </button>
      <a href="/cart">
        <svg viewBox="0 0 24 24" role="img"><title>Cart</title><path d="M0 0" /></svg>
      </a>
      <a href="/">
        <img src="/logo.svg" alt="Acme home" />
      </a>
      <button type="button">{label}</button>
      <button type="button"><Trans id="save" /></button>
      <button {...buttonProps} />
      <a href="/docs">{children}</a>
      <a id="anchor">no href, not a link</a>
    </div>
  )
}
