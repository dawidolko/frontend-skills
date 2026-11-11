/*
 * css/no-stale-prefixes: reports hand-written vendor prefixes for features every current browser supports without
 * them (border-radius, box-shadow, transitions, transforms, animations, flexbox, gradients, calc, @-webkit-keyframes).
 * Prefixes that are still needed are not in the list (-webkit-line-clamp with display: -webkit-box and
 * -webkit-box-orient, -webkit-text-size-adjust, -webkit-tap-highlight-color, -webkit-user-select and others).
 */
const PROP = /^-(webkit|moz|ms|o)-(border(-(top|bottom))?(-(left|right))?-radius|box-shadow|box-sizing|transition(-[a-z-]+)?|transform(-origin|-style)?|animation(-[a-z-]+)?|flex(-[a-z-]+)?|box-flex|box-pack|box-align|align-(items|self|content)|justify-content|order|opacity|background-(size|origin|clip))$/
const VALUE = /-(webkit|moz|ms|o)-((repeating-)?(linear|radial|conic)-gradient|calc)\(|^-(webkit-flex|ms-flexbox|moz-box|webkit-inline-flex)$/

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      if (/^-(webkit|moz|ms|o)-keyframes$/.test(b.atRule || '')) ctx.report(b.line, `@${b.atRule} is not needed; write @keyframes.`)
      const clamp = b.decls.some((d) => d.prop === '-webkit-line-clamp')
      for (const d of b.decls) {
        if (d.prop === '-webkit-background-clip' && d.value === 'text') continue
        if (PROP.test(d.prop)) ctx.report(d.line, `${d.prop} is a stale prefix; write ${d.prop.replace(/^-[a-z]+-/, '')} and let Autoprefixer add what the browserslist needs.`)
        else if (VALUE.test(d.value) || (d.prop === 'display' && d.value === '-webkit-box' && !clamp))
          ctx.report(d.line, `${d.prop}: ${d.value} uses a stale prefix; write the standard value.`)
      }
    }
  }
}
