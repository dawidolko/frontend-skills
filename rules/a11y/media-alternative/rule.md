---
id: a11y/media-alternative
title: Recorded audio has a transcript; recorded video has audio description of what is only shown, or a full text alternative.
severity: serious
check: manual
applies:
  - page
wcag:
  - 1.2.1
  - 1.2.3
  - 1.2.5
level: AA
skill: fe-a11y-media
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.2.1 Audio-only and Video-only (Prerecorded)
    url: https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html
  - title: WCAG 2.2, Understanding SC 1.2.5 Audio Description (Prerecorded)
    url: https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html
  - title: W3C WAI, Making Audio and Video Media Accessible
    url: https://www.w3.org/WAI/media/av/
---

## Why

A podcast without a transcript is closed to deaf people; a product demo where the steps are only shown on screen is closed to blind people. Captions alone do not describe what is seen.

## Fix

Link a transcript right next to every audio player. For video, describe important visual information in the narration itself (the cheapest way), add an audio-described version, or at AA at least provide described audio; a full text transcript with the visual details is the A-level minimum. Keep the transcript as HTML, not a PDF.

## Examples

```html
<!-- good -->
<audio controls src="episode-12.mp3"></audio>
<p><a href="/podcast/12/transcript">Read the transcript of episode 12</a></p>
```
