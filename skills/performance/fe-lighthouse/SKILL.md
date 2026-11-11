---
name: fe-lighthouse
description: Runs and reads Lighthouse 13 for performance, accessibility, best practices and SEO - locally, in Chrome DevTools, PageSpeed Insights and CI with Lighthouse CI - and turns the report into fixes without chasing the score. Use when asked to run Lighthouse or PageSpeed, set up performance budgets or a CI gate, explain a score or an insight, or "get the page to green".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; Lighthouse needs a local Chrome.
metadata:
  title: Lighthouse and PageSpeed
  area: performance
  lane: C
  requires: web
  globs: "**/lighthouserc* **/.lighthouserc* **/*.html"
  rules: "perf/lighthouse-ci perf/field-data-p75 tooling/console-clean perf/lcp-image perf/layout-shift perf/code-split"
  version: 0.1.0
---

# Lighthouse and PageSpeed

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's CI runner) wins over this skill.

## Rules

- The performance score weights TBT 30, LCP 25, CLS 25, FCP 10, Speed Index 10; fix the heaviest failing metric first.
- Run the mobile preset (the default) and `--preset=desktop` separately; report which one.
- Run at least three times and use the median; never gate CI on one run or on 100 (perf/lighthouse-ci).
- A lab score is not a Core Web Vitals result; vitals come from field data at p75 (perf/field-data-p75).
- Lighthouse 13 shows insights (LCP discovery, layout shift culprits, render blocking, third parties) instead of the old opportunities; read them for causes (perf/lcp-image, perf/layout-shift, perf/code-split).
- Accessibility 100 means no automated audit failed, not that the page is accessible; do the manual checks.
- Keep the console free of errors and deprecated APIs (tooling/console-clean).
- Test production builds on a quiet machine in a clean profile (no extensions), not the dev server.
- Never optimise for the score by hiding content from Lighthouse or detecting its user agent.

## Do this

1. Build and serve the production output locally (`npm run build` then the framework's preview), or use the deployed URL.
2. Run `npx github:dawidolko/frontend-skills audit --url <url>`: it runs Lighthouse and axe-core in the local Chrome (after a yes) and maps results to rule ids. Or run `npx lighthouse@13.6.0 <url> --output=json --output-path=./lh.json --quiet`.
3. Read in order: metric values, then the insights for the failing metric, then diagnostics. Fix one cause, rebuild, rerun three times.
4. For CI, add `@lhci/cli` with a `lighthouserc.json`: several URLs, `numberOfRuns: 3`, metric assertions, results kept as artefacts.
5. Write results with the tool version, preset, number of runs and date.

## Check

- `npx github:dawidolko/frontend-skills audit --url <url>` gives the four category scores, the lab metrics and findings by rule id.
- PageSpeed Insights (https://pagespeed.web.dev/) adds field data for public URLs with enough traffic.
- Compare two runs with the Lighthouse viewer or `lhci` server only when both used the same preset and machine.

## References

- [references/lighthouse.md](references/lighthouse.md): scoring weights and curves, throttling presets, categories and their audits, insight ids, CLI and CI recipes, how to read variability. Read it before setting budgets or explaining a score.
