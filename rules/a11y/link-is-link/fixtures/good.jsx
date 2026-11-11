export function Nav({ url, linkProps, onOpen }) {
  return (
    <nav>
      <a href="/cart">Cart</a>
      <a href={url} onClick={onOpen}>Account</a>
      <a {...linkProps}>Docs</a>
      <a href="#main">Skip to content</a>
      <a id="placeholder">Not a link yet</a>
      <button type="button" onClick={onOpen}>Menu</button>
    </nav>
  )
}
