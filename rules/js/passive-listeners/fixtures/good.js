export function attachSlider(slider, track, drag) {
  slider.addEventListener('touchmove', (event) => track(event.touches[0].clientX), { passive: true })
  slider.addEventListener('touchstart', onStart, { passive: false })
  slider.addEventListener('wheel', onWheel)
  slider.addEventListener('touchend', (event) => track(event.changedTouches[0].clientX))
  slider.addEventListener('touchmove', drag)
  window.addEventListener('wheel', (event) => track(event.deltaY))
  document.body.addEventListener('touchmove', (event) => track(event.touches[0].clientY))
  function onStart(event) {
    event.preventDefault()
  }
  function onWheel(event) {
    event.preventDefault()
    track(event.deltaY)
  }
}
