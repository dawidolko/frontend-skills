---
id: a11y/video-captions
title: Recorded video with speech or meaningful sound has synchronised captions, for example a <track kind="captions">.
severity: critical
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 1.2.2
level: A
axe:
  - video-caption
skill: fe-a11y-media
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.2.2 Captions (Prerecorded)
    url: https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html
  - title: MDN, the track element
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track
  - title: W3C WAI, Making Audio and Video Media Accessible (captions)
    url: https://www.w3.org/WAI/media/av/captions/
---

## Why

Without captions, people who are deaf or hard of hearing get nothing from the sound track, and so does everyone watching with the sound off. Auto-generated captions with errors in names and numbers do not count as an equivalent.

## Fix

Ship a WebVTT file and add `<track kind="captions" src="….vtt" srclang="en" label="English" default>` inside `<video>`. Captions include who speaks and meaningful sounds. A video player library must expose its captions button; a silent background video should carry `muted`.

## Examples

```html
<!-- bad -->
<video controls src="launch.mp4"></video>
<!-- good -->
<video controls src="launch.mp4">
  <track kind="captions" src="launch.en.vtt" srclang="en" label="English" default>
</video>
```
