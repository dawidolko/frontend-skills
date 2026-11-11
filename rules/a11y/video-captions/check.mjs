/*
 * a11y/video-captions: reports a <video> that is not muted and has no <track kind="captions"> or
 * kind="subtitles" child. Videos with a spread, a bound muted or kind value, a component child, or an expression in
 * their content (which may render the track) are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

/* True when the content between the start and end tag holds a {…} expression. */
function contentHasExpression(s, el) {
  if (el.end === undefined) return false
  let q = null
  let depth = 0
  let i = el.index + 1
  for (; i < el.end; i++) {
    const c = s[i]
    if (q) {
      if (c === q) q = null
    } else if (c === '"' || c === "'") q = c
    else if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth <= 0) break
  }
  return s.slice(i + 1, el.end).includes('{')
}

export default {
  check(ctx) {
    const all = ctx.elements()
    for (const video of all) {
      if (video.component || video.name !== 'video' || video.spread) continue
      if (video.attrs.has('muted') || contentHasExpression(ctx.text, video)) continue
      let ok = false
      for (const el of all) {
        if (el.parent !== video) continue
        if (el.component || el.spread) ok = true
        if (el.name !== 'track') continue
        const kind = el.attrs.get('kind')
        if (kind?.dynamic && literal(kind) === null) ok = true
        else if (/^(captions|subtitles)$/i.test(literal(kind) || '')) ok = true
      }
      if (!ok) ctx.report(video, '<video> has no captions track; add <track kind="captions" srclang="…" src="….vtt">, unless the captions are burned in.')
    }
  }
}
