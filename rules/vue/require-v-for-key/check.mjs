/*
 * vue/require-v-for-key: reports elements and components with v-for but no key. A spread (v-bind="obj") may carry
 * the key and is left out, and so is a template v-for whose child elements carry the key (the Vue 2 placement).
 */
export default {
  check(ctx) {
    const all = ctx.elements()
    for (const el of all) {
      if (!el.attrs.has('v-for') || el.attrs.has('key') || el.spread) continue
      if (el.name === 'template' && all.some((c) => c.parent === el && (c.attrs.has('key') || c.spread))) continue
      ctx.report(el, `<${el.rawName} v-for="${el.attrs.get('v-for').value}"> has no :key; bind a stable id from the item.`)
    }
  }
}
