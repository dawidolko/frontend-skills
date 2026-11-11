---
id: perf/gif-to-video
title: Animations longer than a small icon are shipped as a muted, looping MP4 or WebM video, not as a GIF over 100 KiB.
severity: moderate
check: static
applies:
  - project
lighthouse:
  - image-delivery-insight
skill: fe-images
since: 0.1.0
sources:
  - title: Chrome for Developers, Image delivery insight
    url: https://developer.chrome.com/docs/performance/insights/image-delivery
  - title: web.dev, Replace animated GIFs with video
    url: https://web.dev/articles/replace-gifs-with-videos
  - title: MDN, the video element
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video
---

## Why

GIF compresses animation poorly: a few seconds of screen recording easily weighs megabytes, slows the page and costs mobile data. The same clip as MP4 or WebM is usually a small fraction of the size, and a `<video>` can also be paused.

## Fix

Convert the GIF (for example with ffmpeg) and embed it as `<video autoplay muted loop playsinline width height>` with an MP4 and a WebM source. Respect reduced motion: do not autoplay when `prefers-reduced-motion: reduce`, and give a pause control when it plays longer than five seconds.

## Examples

```html
<!-- bad -->
<img src="demo.gif" alt="Adding an item to the cart">
<!-- good -->
<video autoplay muted loop playsinline width="640" height="360" aria-label="Adding an item to the cart">
  <source src="demo.webm" type="video/webm">
  <source src="demo.mp4" type="video/mp4">
</video>
```
