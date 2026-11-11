export function attachSlider(slider, track) {
  slider.addEventListener('touchmove', (event) => track(event.touches[0].clientX))
  slider.addEventListener('wheel', onWheel)
  function onWheel(event) {
    track(event.deltaY)
  }
}
