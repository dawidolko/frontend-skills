/*
 * vue/no-v-if-with-v-for: reports elements and components that carry both v-for and v-if.
 */
export default {
  check(ctx) {
    for (const el of ctx.elements())
      if (el.attrs.has('v-for') && el.attrs.has('v-if'))
        ctx.report(el.attrs.get('v-if').line, `v-if and v-for on one <${el.rawName}>; filter with a computed list or move v-if to a wrapper.`)
  }
}
