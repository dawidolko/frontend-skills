/*
 * a11y/no-autoplay-audio: reports an <audio> or <video> with autoplay that is not muted. Elements with a spread or a
 * bound autoplay or muted value are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements(['audio', 'video'])) {
      if (el.spread || !el.attrs.has('autoplay') || el.attrs.has('muted')) continue
      const auto = el.attrs.get('autoplay')
      if (auto.dynamic && !['true', 'autoplay', ''].includes(String(literal(auto)))) continue
      ctx.report(el, `<${el.name} autoplay> plays sound on load; add muted or let people start it.`)
    }
  }
}
