---
id: perf/third-party-cost
title: Each third-party script earns its place, loads late, and heavy embeds (video, maps, chat) start as a lightweight facade.
severity: moderate
check: browser
applies:
  - page
lighthouse:
  - third-parties-insight
skill: fe-perf-delivery
since: 0.1.0
sources:
  - title: web.dev, Efficiently load third-party JavaScript
    url: https://web.dev/articles/efficiently-load-third-party-javascript
  - title: Chrome for Developers, Lazy load third-party resources with facades
    url: https://developer.chrome.com/docs/lighthouse/performance/third-party-facades
  - title: web.dev, Best practices for using third-party embeds
    url: https://web.dev/articles/embed-best-practices
  - title: Chrome for Developers, Third parties insight
    url: https://developer.chrome.com/docs/performance/insights/third-parties
---

## Why

Tag managers, chat widgets, video players and A/B testing tools often outweigh the site's own code, run long tasks during load and interaction, and change without your review. They are a common reason for poor INP and LCP.

## Fix

List every third party with its owner and purpose; remove what nobody uses. Load the rest after the page is usable (`async`, `defer`, framework strategies, or on interaction). Replace embeds with a facade: a static preview image and a play or "load map" button that inserts the real iframe on click. Self-host small libraries instead of loading them from a CDN.

## Examples

```html
<!-- good: a video facade -->
<button type="button" class="video-facade" data-id="abc123">
  <img src="/img/video-poster.webp" alt="" width="1280" height="720">
  <span>Play video: setting up sync</span>
</button>
```
