/*
 * a11y/html-lang: reports an <html> element whose lang attribute is missing or empty. A bound value
 * (lang={locale}) is accepted, since its content is only known at run time.
 */
import { attr, mayHave } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('html')) {
      const lang = attr(el, 'lang')
      if (!mayHave(el, 'lang')) ctx.report(el, '<html> has no lang attribute.')
      else if (lang && !lang.dynamic && lang.value.trim() === '') ctx.report(el, '<html lang=""> is empty.')
    }
  }
}
