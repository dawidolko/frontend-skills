/*
 * css/no-id-selectors: reports a rule block whose selector styles an element by its id (#nav). Attribute selectors
 * ([id="nav"], [href="#top"]), Sass interpolation and keyframe steps are not id selectors. Less files are skipped
 * because Less uses #name for namespaces.
 */
const ID = /#-?[A-Za-z_][\w-]*/

export default {
  check(ctx) {
    if (ctx.kind === 'less') return
    for (const b of ctx.css()) {
      if (b.atRule || b.parents.some((p) => /^@(-\w+-)?keyframes/.test(p))) continue
      const sel = b.prelude.replace(/\[[^\]]*\]/g, '').replace(/(["']).*?\1/g, '').replace(/#\{[^}]*\}/g, '')
      const m = ID.exec(sel)
      if (m) ctx.report(b.line, `"${b.prelude}" styles by id (${m[0]}); use a class so the rule can be reused and overridden.`)
    }
  }
}
