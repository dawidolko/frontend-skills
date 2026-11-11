/*
 * astro/client-only-framework: reports components in .astro files that carry client:only without a framework name
 * as its value. A bound value (client:only={framework}) is accepted.
 */
export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const a = el.attrs.get('client:only')
      if (!a || a.dynamic || a.value.trim()) continue
      ctx.report(el, `<${el.rawName} client:only> needs its framework as the value, for example client:only="react".`)
    }
  }
}
