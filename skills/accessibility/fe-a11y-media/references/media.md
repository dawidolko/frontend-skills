# Media, motion and flashing reference

Depth for the `fe-a11y-media` skill. Rule ids in brackets: `frontend-skills explain <id>`. Criteria read in WCAG 2.2 on 2026-11-11.

## What each criterion asks

| Content | A | AA | Rule |
| --- | --- | --- | --- |
| Recorded audio only (podcast) | Transcript (1.2.1) | same | [a11y/media-alternative] |
| Recorded video only (no sound) | Transcript or audio track describing it (1.2.1) | same | [a11y/media-alternative] |
| Recorded video with sound | Captions (1.2.2) and audio description or text alternative (1.2.3) | Audio description (1.2.5) | [a11y/video-captions] |
| Live video with sound | none | Live captions (1.2.4) | manual |
| Sound that starts by itself | Stop, pause or volume control if over 3 s (1.4.2) | same | [a11y/no-autoplay-audio] |
| Moving, blinking, scrolling, auto-updating | Pause, stop or hide if over 5 s (2.2.2) | same | [a11y/pause-auto-motion] |
| Flashing | At most 3 flashes per second (2.3.1) | same | [a11y/no-flash] |

The cheapest audio description is a script that says what is on screen ("Click Export, top right"), so no separate track is needed.

## Captions with track

```html
<video controls preload="metadata" poster="tour.jpg">
  <source src="tour.webm" type="video/webm">
  <source src="tour.mp4" type="video/mp4">
  <track kind="captions" src="tour.en.vtt" srclang="en" label="English" default>
  <track kind="captions" src="tour.pl.vtt" srclang="pl" label="Polski">
</video>
<p><a href="/tour/transcript">Transcript of the product tour</a></p>
```

```text
WEBVTT

00:00:00.000 --> 00:00:03.500
[upbeat music]

00:00:03.500 --> 00:00:07.000
ANNA: This is the export menu, top right.
```

- `kind="captions"` covers speech plus sounds and speaker names; `kind="subtitles"` is a translation for people who hear the audio.
- Serve `.vtt` files with `Content-Type: text/vtt`; a cross-origin track needs `crossorigin` on `<video>` and CORS headers.

## Background video and reduced motion

```html
<video id="bg" muted loop playsinline poster="hero.jpg" src="hero.mp4"></video>
<button type="button" id="bg-toggle" aria-pressed="false">Pause background video</button>
<script type="module">
  const video = document.getElementById('bg')
  const button = document.getElementById('bg-toggle')
  if (matchMedia('(prefers-reduced-motion: no-preference)').matches) video.play()
  button.addEventListener('click', () => {
    const paused = !video.paused
    paused ? video.pause() : video.play()
    button.setAttribute('aria-pressed', String(paused))
  })
</script>
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

Reduced motion support is a WCAG AAA technique (2.3.3); it is cheap and helps people with vestibular disorders, so treat it as the default.

## Embeds

| Embed | Setting |
| --- | --- |
| YouTube | Upload or edit captions in the channel; `cc_load_policy=1` turns them on by default; give the `<iframe>` a `title`. |
| Vimeo | Add text tracks in the video settings; give the `<iframe>` a `title`. |
| Any iframe player | Check it can be played, paused and have captions switched on with the keyboard alone. |

## Flashing

Effects that alternate light and dark more than three times per second over a large area fail 2.3.1. Saturated red flashes have a stricter threshold. Analyse videos with a photosensitive epilepsy analysis tool (for example the free PEAT from the Trace Center) before publishing.

## Sources

- WCAG 2.2 Understanding 1.2.1 to 1.2.5, 1.4.2, 2.2.2, 2.3.1: https://www.w3.org/WAI/WCAG22/Understanding/
- W3C WAI, Making Audio and Video Media Accessible: https://www.w3.org/WAI/media/av/
- MDN, the track element: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track
- MDN, WebVTT format: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API/Web_Video_Text_Tracks_Format
- MDN, prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- WCAG 2.2 Technique C39 (reduced motion): https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- YouTube embedded player parameters: https://developers.google.com/youtube/player_parameters
