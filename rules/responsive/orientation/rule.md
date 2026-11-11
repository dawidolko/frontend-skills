---
id: responsive/orientation
title: The page works in portrait and landscape; it never locks the orientation or asks people to rotate unless one orientation is essential.
severity: serious
check: manual
applies:
  - page
wcag:
  - 1.3.4
level: AA
skill: fe-responsive
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.3.4 Orientation
    url: https://www.w3.org/WAI/WCAG22/Understanding/orientation.html
  - title: MDN, ScreenOrientation lock()
    url: https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock
---

## Why

Some people have their tablet or phone mounted in one orientation (on a wheelchair, for example) and cannot turn it. A "please rotate your device" screen, a CSS rotation trick or `screen.orientation.lock()` shuts them out.

## Fix

Let the layout adapt to both orientations with fluid layout and media or container queries. Remove rotate-your-device overlays, `@media (orientation: portrait)` rules that hide the main content, and orientation locks in scripts or the web app manifest, unless the orientation is essential (a piano app, a bank cheque scan).

## Examples

```css
/* bad */
@media (orientation: portrait) { main { display: none; } .rotate-message { display: block; } }
/* good */
@media (orientation: portrait) { .gallery { grid-template-columns: 1fr; } }
```
