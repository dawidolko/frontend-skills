/*
 * perf/font-display: reports an @font-face block that has no font-display descriptor.
 */
export default {
  check(ctx) {
    for (const block of ctx.css())
      if (block.atRule === 'font-face' && !block.decls.some((d) => d.prop === 'font-display'))
        ctx.report(block.line, '@font-face has no font-display; add font-display: swap.')
  }
}
