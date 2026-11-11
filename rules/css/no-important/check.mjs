/*
 * css/no-important: reports the first !important declaration of each rule block, except where !important is the
 * tool for the job: utility classes (a block whose selectors are each one class, such as .sr-only or .mt-0), blocks
 * inside a cascade layer named for utilities or overrides, and blocks inside prefers-reduced-motion, forced-colors
 * or print media queries.
 */
const UTILITY_SELECTOR = /^\.[\w-]+(\\:[\w-]+)*$/
const ALLOWED_PARENT = /^@layer\s+[\w.-]*(util|override|vendor|third)|prefers-reduced-motion|forced-colors|^@media\s+print/i

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      const d = b.decls.find((x) => x.important)
      if (!d || b.atRule) continue
      if ([...b.parents, b.prelude].some((p) => ALLOWED_PARENT.test(p))) continue
      if (b.prelude.split(',').every((s) => UTILITY_SELECTOR.test(s.trim()))) continue
      ctx.report(d.line, `${d.prop}: … !important in "${b.prelude}" wins a specificity fight; order the cascade with @layer or a clearer selector instead.`)
    }
  }
}
