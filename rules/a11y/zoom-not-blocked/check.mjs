/*
 * a11y/zoom-not-blocked: reports a viewport meta tag with user-scalable=no/0 or maximum-scale below 2, and in
 * script files the same settings in a Next.js style viewport object (userScalable: false, maximumScale: 1).
 */
import { staticValue } from '../../../engine/helpers.mjs'

export function blocksZoom(content) {
  const parts = Object.fromEntries(
    content
      .toLowerCase()
      .split(/[,;]/)
      .map((p) => p.split('=').map((x) => x.trim()))
      .filter((p) => p[0])
  )
  if (parts['user-scalable'] === 'no' || parts['user-scalable'] === '0') return 'user-scalable=no'
  const max = Number.parseFloat(parts['maximum-scale'])
  if (!Number.isNaN(max) && max < 2) return `maximum-scale=${parts['maximum-scale']}`
  return null
}

export default {
  check(ctx) {
    for (const el of ctx.elements('meta')) {
      if ((staticValue(el, 'name') || '').toLowerCase() !== 'viewport') continue
      const why = blocksZoom(staticValue(el, 'content') || '')
      if (why) ctx.report(el, `The viewport sets ${why}, which blocks zoom.`)
    }
    if (ctx.kind !== 'jsx') return
    const re = /\b(userScalable\s*:\s*false|maximumScale\s*:\s*(?:0?\.\d+|1(?:\.\d+)?)\b)/g
    for (const m of ctx.text.matchAll(re)) ctx.report(ctx.lineOf(m.index), `The viewport export sets ${m[1].replace(/\s+/g, ' ')}, which blocks zoom.`)
  }
}
