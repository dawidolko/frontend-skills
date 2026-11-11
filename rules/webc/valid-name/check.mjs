/*
 * webc/valid-name: reports customElements.define('name', ...) and Lit's @customElement('name') when the literal
 * name is not a valid custom element name: it must start with a lowercase ASCII letter, contain a hyphen, contain
 * no uppercase ASCII letter, whitespace or markup characters, and not be one of the reserved SVG and MathML names.
 * Names built from variables are left out.
 */
import { findInRaw } from '../../js/source.mjs'

const RESERVED = new Set(['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'])

function problem(name) {
  if (RESERVED.has(name)) return 'is reserved'
  if (!/^[a-z]/.test(name)) return 'must start with a lowercase letter'
  if (/[A-Z]/.test(name)) return 'must not contain uppercase letters'
  if (!name.includes('-')) return 'must contain a hyphen'
  if (/[\s"'<>/=]/.test(name)) return 'contains characters a tag name cannot have'
  return null
}

export default {
  check(ctx) {
    for (const re of [/customElements\s*\.\s*define\s*\(\s*(["'`])([^"'`$]*)\1/g, /@customElement\s*\(\s*(["'`])([^"'`$]*)\1/g])
      for (const f of findInRaw(ctx, re)) {
        const why = problem(f.match[2])
        if (why) ctx.report(ctx.lineOf(f.index), `Custom element name "${f.match[2]}" ${why}; use a lowercase name with a hyphen, such as acme-${f.match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'element'}.`)
      }
  }
}
