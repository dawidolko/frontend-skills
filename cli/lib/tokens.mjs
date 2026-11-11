/*
 * Estimates the number of tokens a text costs an agent, with no dependency and no network. Exact counts depend on
 * each model's tokenizer, and Claude's is not published, so this is an estimate: word pieces, digits and punctuation
 * are counted with weights calibrated against the public o200k tokenizer on this repository's own Markdown
 * (tools/calibrate-tokens.mjs; method and measured error in docs/tokens.md). Every number the tool prints says it
 * is an estimate.
 */

export const ESTIMATOR = 'frontend-skills estimate v1 (calibrated on o200k)'

/* Weights fitted by tools/calibrate-tokens.mjs. */
const W = { word: 1, longWord: 0.17, digit: 0.34, punct: 0.8, newline: 0.3 }

/** Estimated tokens of a text. */
export function estimateTokens(text) {
  if (!text) return 0
  let n = 0
  for (const m of text.matchAll(/[\p{L}]+|\d+|\n|[^\s\p{L}\d]/gu)) {
    const t = m[0]
    if (t === '\n') n += W.newline
    else if (/\d/.test(t[0])) n += Math.max(1, t.length * W.digit)
    else if (/\p{L}/u.test(t[0])) n += W.word + Math.max(0, t.length - 6) * W.longWord
    else n += W.punct
  }
  return Math.round(n)
}
