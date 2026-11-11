/*
 * astro/script-processed: reports script elements in .astro files that carry an attribute other than src, which
 * makes Astro skip processing (no bundling, TypeScript or dedupe). An explicit is:inline, data blocks (JSON,
 * JSON-LD, import maps, speculation rules), Partytown scripts and external scripts loaded from a full URL are left
 * out.
 */
const DATA = /json|importmap|speculationrules|partytown/i

export default {
  check(ctx) {
    for (const el of ctx.elements('script')) {
      if (el.attrs.has('is:inline') || el.spread) continue
      if (DATA.test(el.attrs.get('type')?.value || '')) continue
      const src = el.attrs.get('src')
      if (src && /^(?:https?:)?\/\//.test(src.value)) continue
      const extra = [...el.attrs.keys()].filter((k) => k !== 'src')
      if (!extra.length) continue
      const message = extra.includes('define:vars')
        ? 'define:vars makes this script inline and repeated per instance; pass values with data-* attributes instead.'
        : `The ${extra[0]} attribute makes Astro skip processing this script (no bundling, TypeScript or dedupe); remove it or write is:inline.`
      ctx.report(el, message)
    }
  }
}
