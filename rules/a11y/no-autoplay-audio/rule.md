---
id: a11y/no-autoplay-audio
title: No audio plays automatically; autoplaying video is muted, and any sound longer than 3 seconds can be paused or stopped.
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 1.4.2
level: A
axe:
  - no-autoplay-audio
skill: fe-a11y-media
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.2 Audio Control
    url: https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html
  - title: MDN, autoplay guide for media and Web Audio APIs
    url: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
---

## Why

Sound that starts on its own talks over a screen reader, so a blind user cannot hear the page well enough to find the control that stops it. Browsers also block most unmuted autoplay, so the feature is unreliable anyway.

## Fix

Start media only when the person presses play. A decorative autoplaying video gets `muted` (and `playsinline` on iOS). If audio must start by itself, stop it within 3 seconds or put a pause or mute control first on the page.

## Examples

```html
<!-- bad -->
<video autoplay src="promo.mp4"></video>
<!-- good -->
<video autoplay muted loop playsinline src="promo.mp4"></video>
<video controls src="promo.mp4"></video>
```
