/*
 * Small helpers that rule checks share: reading an attribute, telling a static value from a bound one, the class
 * tokens of an element, and whether a file is a whole HTML document. A check that needs something else should add
 * it here rather than re-implement it, so all rules read elements the same way.
 */

/** The attribute record, or undefined. */
export const attr = (el, name) => el.attrs.get(name)

/** True when the element has the attribute, or may have it through a spread. */
export const mayHave = (el, name) => el.spread || el.attrs.has(name)

/** The literal value of an attribute, or null when it is missing or bound to an expression. */
export function staticValue(el, name) {
  const a = el.attrs.get(name)
  if (!a || a.dynamic) return null
  return a.value
}

/** A JSX/Vue/Svelte expression that is a plain string or number literal, unwrapped; otherwise null. */
export function literal(a) {
  if (!a) return null
  if (!a.dynamic) return a.value
  const m = /^(?:"([^"]*)"|'([^']*)'|`([^`$]*)`|(-?\d+(?:\.\d+)?))$/.exec(a.value.trim())
  return m ? (m[1] ?? m[2] ?? m[3] ?? m[4]) : null
}

/** The static class tokens of an element (class, className, Vue :class string literals are not resolved). */
export function classTokens(el) {
  const a = el.attrs.get('class')
  if (!a) return []
  const v = a.dynamic ? (literal(a) ?? a.value.replace(/[`'"{}()[\]$:?,]/g, ' ')) : a.value
  return v.split(/\s+/).filter(Boolean)
}

/** True when the file holds a whole document: an <html> element or a doctype. */
export const isDocument = (ctx) => ctx.doctype || ctx.elements('html').length > 0
