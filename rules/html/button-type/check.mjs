/*
 * html/button-type: reports a <button> element with no type attribute. Elements with a spread are skipped.
 */
import { mayHave } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('button')) if (!mayHave(el, 'type')) ctx.report(el, '<button> has no type; it submits its form by default.')
  }
}
