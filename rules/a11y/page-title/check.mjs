/*
 * a11y/page-title: reports a <head> with no <title> in an HTML or Astro document. A head that contains a component
 * (an SEO component, a layout slot) is skipped, because the component may render the title.
 */
export default {
  check(ctx) {
    const all = ctx.elements()
    for (const head of ctx.elements('head')) {
      const inside = all.filter((e) => e.ancestors.includes('head') && e.index > head.index && (head.end === undefined || e.index < head.end))
      if (inside.some((e) => e.component || e.name === 'slot')) continue
      if (!inside.some((e) => e.name === 'title' && (e.text || '').trim())) ctx.report(head, 'The document has no non-empty <title>.')
    }
  }
}
