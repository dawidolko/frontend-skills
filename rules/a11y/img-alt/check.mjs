/*
 * a11y/img-alt: reports img and area elements with no alt attribute. An element with a spread of props is skipped,
 * because alt may come from the spread; components such as next/image are checked by their own rules.
 */
import { mayHave } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements(['img', 'area']))
      if (!mayHave(el, 'alt')) ctx.report(el, `<${el.name}> has no alt attribute; describe it, or use alt="" if it is decorative.`)
  }
}
