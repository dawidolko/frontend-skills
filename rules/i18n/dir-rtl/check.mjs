/*
 * i18n/dir-rtl: reports an <html> element whose literal lang is a right-to-left language (Arabic, Hebrew, Persian,
 * Urdu, Pashto, Sindhi, Uyghur, Yiddish, Dhivehi, Kurdish Sorani, Syriac, or a tag with the Arab or Hebr script) and
 * that has no dir attribute. Bound values are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

const RTL = /^(ar|he|iw|fa|ur|ps|sd|ug|yi|dv|ckb|syr|arc|nqo)(-|$)|-(arab|hebr|thaa|syrc|nkoo)(-|$)/i

export default {
  check(ctx) {
    for (const el of ctx.elements('html')) {
      if (el.spread || el.attrs.has('dir')) continue
      const lang = literal(el.attrs.get('lang'))
      if (lang && RTL.test(lang.trim())) ctx.report(el, `<html lang="${lang}"> is a right-to-left language; add dir="rtl".`)
    }
  }
}
