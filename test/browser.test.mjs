/*
 * The page audit without a browser: Lighthouse and axe-core results are mapped to dictionary ids through each
 * rule's `lighthouse` and `axe` keys (unmapped results keep the tool's id), bad addresses are refused, and without
 * the tools and without --yes nothing is fetched and the reason is returned.
 */
import assert from 'node:assert/strict'
import { mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { loadRules } from '../cli/lib/catalog.mjs'
import { cacheDir, mapAxe, mapLighthouse, runBrowserAudit } from '../engine/browser.mjs'

const rules = loadRules()
const url = 'http://localhost:5173/'

test('axe-core violations map to rule ids, unknown ones keep the axe id', () => {
  const results = {
    violations: [
      { id: 'image-alt', impact: 'critical', help: 'Images must have alternative text', helpUrl: 'https://example.test/image-alt', nodes: [{ target: ['main > img'] }] },
      { id: 'color-contrast', impact: 'serious', help: 'Elements must meet minimum color contrast ratio thresholds', helpUrl: 'https://example.test/cc', nodes: [{ target: ['.muted'] }, { target: ['.hint'] }] }
    ]
  }
  const f = mapAxe(results, rules, url)
  assert.deepEqual(f.map((x) => [x.id, x.severity, x.line]), [['a11y/img-alt', 'critical', 0], ['axe/color-contrast', 'serious', 0]])
  assert.match(f[1].message, /\(2×\): \.muted, \.hint/)
})

test('Lighthouse audits below 0.9 map to rule ids; scores and lab metrics are kept', () => {
  const lhr = {
    categories: { performance: { score: 0.71 }, accessibility: { score: 0.88 } },
    audits: {
      'unsized-images': { score: 0.5, title: 'Image elements do not have explicit width and height', scoreDisplayMode: 'metricSavings', details: { items: [{ node: { selector: 'img.hero' } }] } },
      'font-display': { score: 1, title: 'ok' },
      'largest-contentful-paint': { score: 0.4, title: 'Largest Contentful Paint', displayValue: '4.1 s', scoreDisplayMode: 'numeric' },
      'cumulative-layout-shift': { score: 0.95, displayValue: '0.05', scoreDisplayMode: 'numeric' },
      'manual-thing': { score: 0, scoreDisplayMode: 'manual' }
    }
  }
  const r = mapLighthouse(lhr, rules, url)
  assert.deepEqual(r.findings.map((x) => [x.id, x.severity]), [['perf/img-dimensions', 'moderate'], ['lighthouse/largest-contentful-paint', 'serious']])
  assert.deepEqual(r.scores, { performance: 71, accessibility: 88 })
  assert.equal(r.metrics.LCP, '4.1 s')
  assert.equal(r.metrics.CLS, '0.05')
})

test('no tools, no --yes, no terminal: nothing is fetched and the reason says how', async () => {
  const cache = mkdtempSync(path.join(tmpdir(), 'fs cache '))
  const r = await runBrowserAudit({ url, rules, env: { FRONTEND_SKILLS_CACHE: cache } })
  assert.match(r.unavailable, /--yes/)
  assert.deepEqual(readdirSync(cache), [])
  assert.match((await runBrowserAudit({ url: 'not a url', rules })).unavailable, /not a URL/)
  assert.match((await runBrowserAudit({ url: 'file:///etc/passwd', rules })).unavailable, /http and https/)
  assert.equal(cacheDir({ FRONTEND_SKILLS_CACHE: cache }), cache)
})
