/*
 * tailwind/sr-only-label: reports an element with the class hidden (no variant) inside a button or link when the
 * control has no aria-label, aria-labelledby or title and no other text outside that element. A control whose
 * content holds an expression ({label}, {{ label }}) or a title or aria-label on an inner element is left out,
 * because its name may come from there.
 */
import { literalClasses } from '../tw.mjs'

function visibleText(inner) {
  let out = ''
  let i = 0
  while (i < inner.length) {
    const c = inner[i]
    if (c === '<') {
      let depth = 0
      let q = null
      i++
      for (; i < inner.length; i++) {
        const d = inner[i]
        if (q) {
          if (d === q) q = null
        } else if (d === '"' || d === "'") q = d
        else if (d === '{') depth++
        else if (d === '}') depth--
        else if (d === '>' && depth === 0 && inner[i - 1] !== '=') break
      }
      i++
      continue
    }
    if (c === '{') return null
    out += c
    i++
  }
  return out.replace(/&nbsp;/g, ' ').trim()
}

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const cls = literalClasses(el)
      if (!cls || !cls.includes('hidden') || el.end === undefined) continue
      let control = el.parent
      while (control && !['button', 'a'].includes(control.name)) control = control.parent
      if (!control || control.component || control.spread || control.end === undefined) continue
      if (['aria-label', 'aria-labelledby', 'title'].some((n) => control.attrs.has(n))) continue
      const inner = ctx.text.slice(control.index, el.index) + ctx.text.slice(el.end, control.end)
      if (/\b(?:aria-label|aria-labelledby)\s*=|<title\b/.test(inner.slice(1))) continue
      const text = visibleText(inner)
      if (text === null || text !== '') continue
      ctx.report(el, `The ${control.name}'s only text is hidden (display: none), so it has no name; use sr-only (md:not-sr-only) instead of hidden.`)
    }
  }
}
