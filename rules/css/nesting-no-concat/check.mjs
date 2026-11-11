/*
 * css/nesting-no-concat: in plain .css files (native nesting), reports a nested selector that glues a suffix to
 * "&" (&__title, &-active, &_mod), which only Sass and the postcss-nested plugin understand; browsers drop the
 * rule. SCSS and Less files are skipped, and so is a project whose profile mentions postcss-nested.
 */
export default {
  check(ctx) {
    if (ctx.kind !== 'css' || JSON.stringify(ctx.profile || {}).includes('postcss-nested')) return
    for (const b of ctx.css()) {
      if (!b.parents.length || b.atRule) continue
      const m = /(^|,\s*)&([\w-]+)/.exec(b.prelude)
      if (m) ctx.report(b.line, `"${b.prelude}" joins "&" and "${m[2]}"; native CSS nesting cannot build class names, so the rule is dropped. Write the full selector.`)
    }
  }
}
