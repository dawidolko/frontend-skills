export function openPartner(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
  window.open('/auth/popup', 'oauth', 'width=480,height=640')
  return <a href={url} target="_blank">Partner site</a>
}
