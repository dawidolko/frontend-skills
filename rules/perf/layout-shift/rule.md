---
id: perf/layout-shift
title: Nothing moves after it appears - space is reserved for images, embeds, ads and late content (CLS 0.1 or less).
severity: moderate
check: browser
applies:
  - page
lighthouse:
  - cls-culprits-insight
skill: fe-core-web-vitals
since: 0.1.0
sources:
  - title: web.dev, Cumulative Layout Shift
    url: https://web.dev/articles/cls
  - title: web.dev, Optimize Cumulative Layout Shift
    url: https://web.dev/articles/optimize-cls
  - title: Chrome for Developers, Layout shift culprits insight
    url: https://developer.chrome.com/docs/performance/insights/cls-culprit
---

## Why

Content that jumps makes people lose their place or tap the wrong button. CLS adds up the unexpected shifts; "good" is 0.1 or less at the 75th percentile. The usual causes are images without dimensions, embeds and ads that load late, web fonts that swap with different metrics, and banners inserted above the content.

## Fix

Give images and videos `width` and `height` (perf/img-dimensions), embeds and ad slots a `min-height` or `aspect-ratio` that stays even when empty, fonts a metric-matched fallback (`size-adjust`), and put cookie banners and toasts over the content or at the bottom instead of pushing it down. Animate with `transform`, never `top` or `height`.

## Examples

```css
/* good: the slot keeps its space whether the ad loads or not */
.ad-slot { min-height: 250px; }
.video-embed { aspect-ratio: 16 / 9; width: 100%; }
```
