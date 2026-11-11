# Lighthouse and PageSpeed reference

Depth for the `fe-lighthouse` skill. Rule ids in brackets: `frontend-skills explain <id>`. Facts read on 2026-11-11: Lighthouse 13.6.0 (published 2026-10-27, `default-config.js` of that tag), `@lhci/cli` 0.16.0, scoring documentation on developer.chrome.com.

## Performance score

| Metric | Weight | Mobile: score 0.9 at / 0.5 at | Desktop: 0.9 / 0.5 |
| --- | --- | --- | --- |
| Total Blocking Time | 30 | 200 ms / 600 ms | 150 ms / 350 ms |
| Largest Contentful Paint | 25 | 2.5 s / 4.0 s | 1.2 s / 2.4 s |
| Cumulative Layout Shift | 25 | 0.1 / 0.25 | 0.1 / 0.25 |
| First Contentful Paint | 10 | 1.8 s / 3.0 s | 0.93 s / 1.6 s |
| Speed Index | 10 | 3.4 s / 5.8 s | 1.3 s / 2.3 s |

- Each metric maps to 0–100 on a log-normal curve; the score is the weighted average. Points above ~96 are very hard to earn.
- Bands: 0–49 poor, 50–89 needs improvement, 90–100 good.
- INP has weight 0 in navigation mode; TBT stands in for it in the lab.
- Insights and diagnostics have weight 0: they explain, they do not score.

## Throttling (default `simulate`)

| Preset | Network | CPU | Screen |
| --- | --- | --- | --- |
| Mobile (default) | RTT 150 ms, 1.6 Mbps down, 750 Kbps up | 4× slowdown | 412 × 823, DPR 1.75 |
| Desktop (`--preset=desktop`) | RTT 40 ms, 10 Mbps | 1× | 1350 × 940, DPR 1 |

## Categories

| Category | How it scores | Notes |
| --- | --- | --- |
| Performance | Weighted metrics | Above |
| Accessibility | Weighted pass/fail of axe-core audits (critical 10, serious 7, moderate 3, minor 1) | One failing element fails the audit; manual audits do not count |
| Best Practices | Weighted pass/fail | HTTPS, console errors [tooling/console-clean], deprecations, paste-blocking inputs, image aspect ratio |
| SEO | Weighted pass/fail | `is-crawlable` dominates; title, description, status code, link text, crawlable anchors, robots.txt, alt, hreflang, canonical |
| Agentic Browsing | Fraction, labelled as under development | New in 13.3; not part of the four classic scores |

The PWA category was removed in Lighthouse 12.

## Insights that replaced opportunities (Lighthouse 13)

| Insight id | Look for | Rule |
| --- | --- | --- |
| `lcp-discovery-insight` | LCP image late, lazy or low priority | [perf/lcp-image] |
| `lcp-breakdown-insight` | Which LCP subpart is slow | [perf/lcp-image] |
| `cls-culprits-insight` | Unsized images, fonts, injected content | [perf/layout-shift] |
| `render-blocking-insight` | Blocking CSS and scripts | [perf/render-blocking-script] |
| `third-parties-insight` | Cost per third party | [perf/third-party-cost] |
| `cache-insight` | Short cache lifetimes | [perf/cache-static-assets] |
| `legacy-javascript-insight` | Polyfills for Baseline features | [perf/no-legacy-javascript] |
| `image-delivery-insight` | Oversized or old-format images | fe-images |
| `font-display-insight` | Text hidden while fonts load | [perf/font-display] |
| `document-latency-insight` | Redirects, slow server, no compression | fe-perf-delivery |
| `forced-reflow-insight`, `dom-size-insight` | Layout thrashing, large DOM | [perf/yield-long-tasks] |

## Commands

```bash
# one run, mobile, JSON
npx lighthouse@13.6.0 http://localhost:4173/ --output=json --output-path=./lh-mobile.json --quiet --chrome-flags="--headless=new"
# desktop
npx lighthouse@13.6.0 http://localhost:4173/ --preset=desktop --output=html --output-path=./lh-desktop.html
# only some categories
npx lighthouse@13.6.0 <url> --only-categories=performance,accessibility
```

## Lighthouse CI [perf/lighthouse-ci]

```bash
npm install --save-dev @lhci/cli@0.16.0
npx lhci autorun   # reads lighthouserc.json: collect, assert, upload
```

- `collect.staticDistDir` serves a static build; `collect.startServerCommand` starts a preview server.
- `upload.target: "temporary-public-storage"` publishes reports to a public link; use `filesystem` for private projects.
- Keep `numberOfRuns` at 3 or 5; assert with `warn` near the target and `error` clearly below it.

## Reading a change

- Differences under ~5 points between single runs are noise. Compare medians of the same preset on the same machine.
- A worse score after a change: open both JSON reports in the viewer and compare the metric that moved, then its insight.
- Never claim a Core Web Vitals pass from these numbers [perf/field-data-p75].

## Sources

- Lighthouse releases: https://github.com/GoogleChrome/lighthouse/releases
- Performance scoring: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
- Accessibility scoring: https://developer.chrome.com/docs/lighthouse/accessibility/scoring
- Insights: https://developer.chrome.com/docs/performance/insights
- Throttling: https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- PageSpeed Insights: https://pagespeed.web.dev/
