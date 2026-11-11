/*
 * css/no-important: reports the first !important declaration of each rule block, except where !important is the
 * tool for the job: utility classes (a block whose selectors are each one class, such as .sr-only or .mt-0), blocks
 * inside a cascade layer named for utilities or overrides, and blocks inside prefers-reduced-motion, forced-colors
 * or print media queries, and global mode overrides scoped to a state of the root (html.high-contrast …,
 * :root[data-theme] …), such as a theme or an accessibility panel's contrast mode.
 */
const UTILITY_SELECTOR = /^\.[\w-]+(\\:[\w-]+)*$|^(html|:root|body)[.[]/
const ALLOWED_PARENT = /^@layer\s+[\w.-]*(util|override|vendor|third)|prefers-reduced-motion|forced-colors|^@media\s+print/i

/** Splits a selector list on its top-level commas (not those inside :is(), :not(), :where() or attribute values). */
function selectorList(sel) {
  const out = []
  let depth = 0
  let start = 0
  for (let i = 0; i < sel.length; i++) {
    const c = sel[i]
    if (c === '(' || c === '[') depth++
    else if (c === ')' || c === ']') depth--
    else if (c === ',' && depth === 0) {
      out.push(sel.slice(start, i).trim())
      start = i + 1
    }
  }
  out.push(sel.slice(start).trim())
  return out.filter(Boolean)
}

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      const d = b.decls.find((x) => x.important)
      if (!d || b.atRule) continue
      if ([...b.parents, b.prelude].some((p) => ALLOWED_PARENT.test(p))) continue
      if (selectorList(b.prelude).every((s) => UTILITY_SELECTOR.test(s))) continue
      ctx.report(d.line, `${d.prop}: … !important in "${b.prelude}" wins a specificity fight; order the cascade with @layer or a clearer selector instead.`)
    }
  }
}
