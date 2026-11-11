---
id: perf/lighthouse-ci
title: Lighthouse in CI runs each URL several times, asserts on metrics and categories with realistic thresholds, and never demands a perfect 100.
severity: minor
check: manual
applies:
  - project
skill: fe-lighthouse
since: 0.1.0
sources:
  - title: Lighthouse CI, configuration (collect.numberOfRuns, assert)
    url: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
  - title: Chrome for Developers, Lighthouse performance scoring (variability)
    url: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
---

## Why

A single Lighthouse run varies with CPU load, network and extensions, so a CI gate on one run fails at random and teaches people to ignore it. A gate at 100 is the same: the curve makes the last points almost unreachable and the score says nothing about real visitors.

## Fix

Use `@lhci/cli` with `numberOfRuns: 3` or more (the median is used), assert on the metrics that matter (`largest-contentful-paint`, `cumulative-layout-shift`, `total-blocking-time`) and on category scores with `warn` below and `error` well below your target, and test the URLs of each page type. Run on a dedicated, quiet runner; compare with the previous main build rather than an absolute number when you can.

## Examples

```json
{
  "ci": {
    "collect": { "url": ["http://localhost:4173/", "http://localhost:4173/pricing"], "numberOfRuns": 3 },
    "assert": { "assertions": {
      "categories:performance": ["warn", { "minScore": 0.9 }],
      "categories:accessibility": ["error", { "minScore": 0.95 }],
      "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
      "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
    } }
  }
}
```
