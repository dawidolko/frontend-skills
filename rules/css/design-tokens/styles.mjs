/*
 * Shared by the project-level CSS checks (css/design-tokens, css/no-magic-numbers, css/z-index-scale): reads every
 * style source of the project once (stylesheets and the <style> blocks of components), and collects the design
 * tokens the project defines (custom properties, Sass and Less variables) with normalised values, so a check can
 * tell "this literal already has a token" from "this project has no token for it".
 */
import { parseCss } from '../../../engine/parse/css.mjs'
import { lineIndex, parseMarkup } from '../../../engine/parse/markup.mjs'

const STYLE_KINDS = new Set(['css', 'scss', 'less'])
const MARKUP_KINDS = new Set(['html', 'vue', 'svelte', 'astro', 'angular'])
const cache = new WeakMap()

/** Every style source: { file, kind, text, blocks, lineOf }. Cached per audit (keyed on the file list). */
export function styleSources(ctx) {
  if (cache.has(ctx.files)) return cache.get(ctx.files)
  const out = []
  for (const f of ctx.files) {
    if (STYLE_KINDS.has(f.kind)) {
      const text = ctx.read(f.path)
      const lineOf = lineIndex(text)
      out.push({ file: f.path, kind: f.kind, text, lineOf, blocks: parseCss(text, { scss: f.kind !== 'css', lineOf }).blocks })
    } else if (MARKUP_KINDS.has(f.kind)) {
      const text = ctx.read(f.path)
      if (!text.includes('<style')) continue
      const m = parseMarkup(text, f.kind)
      const blocks = []
      for (const st of m.styles) {
        if (!/^(css|scss|postcss|less)$/i.test(st.lang)) continue
        blocks.push(...parseCss(text.slice(st.start, st.end), { offset: st.start, lineOf: m.line, scss: st.lang !== 'css' }).blocks)
      }
      out.push({ file: f.path, kind: f.kind, text, lineOf: m.line, blocks })
    }
  }
  cache.set(ctx.files, out)
  return out
}

/** Lower-case colour with #abc expanded to #aabbcc and spaces removed, or null when the text is not one colour. */
export function normColour(v) {
  const s = v.trim().toLowerCase().replace(/\s*!default$/, '')
  let m = /^#([0-9a-f]{3,8})$/.exec(s)
  if (m) {
    const h = m[1]
    if (h.length === 3 || h.length === 4) return `#${[...h].map((c) => c + c).join('')}`
    return h.length === 6 || h.length === 8 ? s : null
  }
  m = /^(rgba?|hsla?|oklch|oklab|lab|lch|hwb)\([^()]*\)$/.exec(s)
  return m ? s.replace(/\s+/g, '') : null
}

/** Colour literals in a declaration value (url() contents are ignored, so url(#mask) is not a colour). */
export function coloursIn(value) {
  const v = value.replace(/url\([^)]*\)/gi, '')
  return (v.match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\([^()]*\)/g) || []).map(normColour).filter(Boolean)
}

/** A px or rem length as px (rem and em at 16px), or null. */
export function toPx(token) {
  const m = /^(-?\d*\.?\d+)(px|rem|em)$/.exec(token.trim())
  if (!m) return null
  const n = Number(m[1])
  return m[2] === 'px' ? n : n * 16
}

/** The design tokens: [{ name, ref, value, file, line }], ref being how code uses it: var(--x), $x or @x. */
export function collectTokens(sources) {
  const out = []
  for (const src of sources) {
    for (const b of src.blocks)
      for (const d of b.decls) if (d.prop.startsWith('--')) out.push({ name: d.prop.slice(2), ref: `var(${d.prop})`, value: d.value, file: src.file, line: d.line })
    const vars = src.kind === 'less' ? /^[ \t]*@([\w-]+)\s*:\s*([^;{}]+);/gm : src.kind === 'scss' ? /^[ \t]*\$([\w-]+)\s*:\s*([^;{}]+);/gm : null
    if (!vars) continue
    let m
    while ((m = vars.exec(src.text))) {
      const sigil = src.kind === 'less' ? '@' : '$'
      out.push({ name: m[1], ref: `${sigil}${m[1]}`, value: m[2].replace(/\s*!default\s*$/, '').trim(), file: src.file, line: src.lineOf(m.index) })
    }
  }
  return out
}

export const SPACE_NAME = /(^|[-_])(space|spacing|spacer|gap|gutter)s?([-_]|$)/i
export const SPACING_PROPS = /^(margin|padding)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$|^(gap|row-gap|column-gap)$/
export const OFFSET_PROPS = /^(top|right|bottom|left|inset(-(inline|block)(-(start|end))?)?)$/

/** Spacing tokens whose value is one length: Map px → token (first definition wins). */
export function spacingScale(tokens) {
  const scale = new Map()
  for (const t of tokens) {
    if (!SPACE_NAME.test(t.name)) continue
    const px = toPx(t.value)
    if (px !== null && px > 0 && !scale.has(px)) scale.set(px, t)
  }
  return scale
}
