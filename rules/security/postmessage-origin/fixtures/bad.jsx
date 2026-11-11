export function connectWidget(frame, token) {
  frame.contentWindow.postMessage({ type: 'auth', token }, '*')
  window.addEventListener('message', (event) => {
    if (event.data.type === 'resize') frame.style.height = event.data.height + 'px'
  })
}
