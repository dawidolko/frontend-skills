/*
 * a11y/lang-valid: reports a lang (or xml:lang) attribute whose literal value is not a well-formed BCP 47 language
 * tag, such as "en_US" or "english". Empty values are left to a11y/html-lang; bound values and template
 * placeholders are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

const TAG = /^(?:[a-z]{2,3}(?:-[a-z]{3}){0,3}|x-[a-z0-9]{1,8}(?:-[a-z0-9]{1,8})*)(?:-[a-z]{4})?(?:-(?:[a-z]{2}|\d{3}))?(?:-(?:[a-z0-9]{5,8}|\d[a-z0-9]{3}))*(?:-[0-9a-wyz](?:-[a-z0-9]{2,8})+)*(?:-x(?:-[a-z0-9]{1,8})+)?$/i

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component) continue
      for (const name of ['lang', 'xml:lang']) {
        const v = literal(el.attrs.get(name))
        if (v === null || v.trim() === '' || /[{}$<%]/.test(v)) continue
        if (!TAG.test(v.trim())) ctx.report(el, `${name}="${v}" is not a valid language tag; use a BCP 47 tag such as "en", "en-GB" or "pl".`)
      }
    }
  }
}
