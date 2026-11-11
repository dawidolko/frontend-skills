#!/usr/bin/env node
/*
 * Calibrates the dependency-free token estimator (cli/lib/tokens.mjs) against the public o200k tokenizer (the
 * gpt-tokenizer dev dependency) on this repository's own Markdown: skills, references, rules and docs. It fits the
 * five weights by least squares and prints them; with --check it fails when the current estimator's error on the
 * corpus exceeds 10% in total or 25% on any file of 200 tokens or more. Method and numbers: docs/tokens.md.
 * Usage: node tools/calibrate-tokens.mjs [--check] [--json]
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { countTokens } from 'gpt-tokenizer'
import { PACKAGE_ROOT } from '../cli/lib/catalog.mjs'
import { estimateTokens } from '../cli/lib/tokens.mjs'

function corpus() {
  const out = []
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.md')) out.push(p)
    }
  }
  for (const d of ['skills', 'rules', 'docs']) walk(path.join(PACKAGE_ROOT, d))
  return out.map((f) => ({ file: path.relative(PACKAGE_ROOT, f).split(path.sep).join('/'), text: readFileSync(f, 'utf8') }))
}

/* The same features the estimator weighs. */
function features(text) {
  const f = [0, 0, 0, 0, 0]
  for (const m of text.matchAll(/[\p{L}]+|\d+|\n|[^\s\p{L}\d]/gu)) {
    const t = m[0]
    if (t === '\n') f[4]++
    else if (/\d/.test(t[0])) f[2] += t.length
    else if (/\p{L}/u.test(t[0])) {
      f[0]++
      f[1] += Math.max(0, t.length - 6)
    } else f[3]++
  }
  return f
}

/* Least squares without intercept: solve (XᵀX) w = Xᵀy by Gaussian elimination. */
function fit(rows, ys) {
  const n = rows[0].length
  const A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => rows.reduce((s, r) => s + r[i] * r[j], 0)))
  const b = Array.from({ length: n }, (_, i) => rows.reduce((s, r, k) => s + r[i] * ys[k], 0))
  for (let c = 0; c < n; c++) {
    let p = c
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
    ;[A[c], A[p]] = [A[p], A[c]]
    ;[b[c], b[p]] = [b[p], b[c]]
    for (let r = 0; r < n; r++) {
      if (r === c || A[c][c] === 0) continue
      const k = A[r][c] / A[c][c]
      for (let j = c; j < n; j++) A[r][j] -= k * A[c][j]
      b[r] -= k * b[c]
    }
  }
  return b.map((v, i) => (A[i][i] ? v / A[i][i] : 0))
}

const files = corpus()
const truth = files.map((f) => countTokens(f.text))
const weights = fit(
  files.map((f) => features(f.text)),
  truth
)
const est = files.map((f) => estimateTokens(f.text))
const total = truth.reduce((a, b) => a + b, 0)
const totalEst = est.reduce((a, b) => a + b, 0)
const errs = files.map((f, i) => ({ file: f.file, tokens: truth[i], estimate: est[i], error: (est[i] - truth[i]) / truth[i] }))
const big = errs.filter((e) => e.tokens >= 200)
const worst = big.reduce((w, e) => (Math.abs(e.error) > Math.abs(w.error) ? e : w), big[0])
const meanAbs = big.reduce((s, e) => s + Math.abs(e.error), 0) / big.length
const result = {
  files: files.length,
  tokens: total,
  estimate: totalEst,
  totalError: (totalEst - total) / total,
  meanAbsError: meanAbs,
  worst,
  fittedWeights: { word: weights[0], longWord: weights[1], digit: weights[2], punct: weights[3], newline: weights[4] }
}
if (process.argv.includes('--json')) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
else {
  const pct = (x) => `${(x * 100).toFixed(1)}%`
  process.stdout.write(
    `${files.length} files, ${total} o200k tokens, estimated ${totalEst} (total error ${pct(result.totalError)}, mean absolute error per file ${pct(meanAbs)}, worst ${worst.file} ${pct(worst.error)}).\n` +
      `Fitted weights: ${Object.entries(result.fittedWeights)
        .map(([k, v]) => `${k} ${v.toFixed(3)}`)
        .join(', ')}\n`
  )
}
if (process.argv.includes('--check')) {
  const fail = Math.abs(result.totalError) > 0.1 || big.some((e) => Math.abs(e.error) > 0.25)
  if (fail) process.stderr.write('The estimator is off by more than its tolerance; update the weights in cli/lib/tokens.mjs.\n')
  process.exitCode = fail ? 1 : 0
}
