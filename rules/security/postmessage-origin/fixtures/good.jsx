const WIDGET_ORIGIN = 'https://widget.example.com'

export function connectWidget(frame, token, worker) {
  frame.contentWindow.postMessage({ type: 'auth', token }, WIDGET_ORIGIN)
  window.addEventListener('message', (event) => {
    if (event.origin !== WIDGET_ORIGIN || event.source !== frame.contentWindow) return
    if (event.data.type === 'resize') frame.style.height = `${Number(event.data.height)}px`
  })
  worker.postMessage({ type: 'start' })
}
