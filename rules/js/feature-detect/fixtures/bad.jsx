export function ShareButton({ onShare }) {
  const mobile = /iPhone|Android/.test(navigator.userAgent)
  return mobile ? <button type="button" onClick={onShare}>Share</button> : null
}
