// document.write('x') in a comment is not code
export function loadWidget() {
  const script = Object.assign(document.createElement('script'), { src: 'https://example.com/widget.js', async: true })
  document.head.append(script)
  return 'avoid document.write()'
}
