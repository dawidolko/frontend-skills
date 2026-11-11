---
id: perf/large-image
title: An image file in the source stays under the image budget (250 KB by default); larger ones are resized or re-encoded.
severity: moderate
check: static
applies:
  - project
lighthouse:
  - image-delivery-insight
skill: fe-images
since: 0.1.0
sources:
  - title: web.dev, Choose the right image format
    url: https://web.dev/articles/choose-the-right-image-format
  - title: Chrome for Developers, Efficiently encode images
    url: https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images
---

## Why

Images are usually the heaviest part of a page and often its Largest Contentful Paint element. A multi-megabyte photo costs mobile users time and data. The 250 KB budget is this tool's default, not a number from a standard; set `audit.budgets.imageKB` in the profile to change it.

## Fix

Resize the image to the largest size it is displayed at (and provide smaller ones with `srcset`), and encode it as AVIF or WebP at a sensible quality. Framework image components and build plugins can do both at build time.

## Examples

```text
bad:  public/hero.png   2.4 MB, 4000×3000, shown at 1200×900
good: public/hero.avif  140 KB, 1200×900, with 600w and 900w variants in srcset
```
