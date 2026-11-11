export function Toolbar({ onClose }) {
  return (
    <div>
      <button type="button" onClick={onClose}>
        <XIcon aria-hidden="true" />
      </button>
      <a href="/cart">
        <svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>
      </a>
      <a href="/">
        <img src="/logo.svg" alt="" />
      </a>
      <button type="button"></button>
    </div>
  )
}
