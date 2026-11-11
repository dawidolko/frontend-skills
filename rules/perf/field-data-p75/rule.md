---
id: perf/field-data-p75
title: Claims about Core Web Vitals come from field data at the 75th percentile, not from a Lighthouse score.
severity: minor
check: manual
applies:
  - project
skill: fe-lighthouse
since: 0.1.0
sources:
  - title: web.dev, Web Vitals (field and lab, 75th percentile)
    url: https://web.dev/articles/vitals
  - title: web.dev, Why lab and field data can be different
    url: https://web.dev/articles/lab-and-field-data-differences
---

## Why

Lighthouse simulates one visit on one device and network; it cannot measure INP and does not see real caches, devices or user behaviour. A green score with failing field data, or the opposite, is common. Saying "the page passes Core Web Vitals" after a lab run misleads the team and the client of the site.

## Fix

Report lab results as "Lighthouse (lab, mobile preset)" with the version and the median of several runs, and use them to find causes. Report vitals from the field: PageSpeed Insights' field section or CrUX for public pages with enough traffic, or your own `web-vitals` data, at the 75th percentile, mobile and desktop apart.

## Examples

```text
bad:  "Performance fixed: Lighthouse 98, Core Web Vitals passed."
good: "Lab (Lighthouse 13.6, mobile, median of 3): LCP 2.1 s, TBT 120 ms. Field (CrUX, 28 days, p75): LCP 2.4 s, INP 180 ms, CLS 0.04."
```
