/*
 * css/icon-from-set: the CSS half of the icon rule. It runs only when the project has a generated icon set: a
 * helper in the profile (icon-classes or icon-sprite), or one visible in the file (an @use/@import of an icons
 * module, an icon mixin, or icon classes such as .icon-…). It then reports url() to an SVG icon file in background,
 * mask, content, list-style or border-image: an .svg under an icons folder, an .svg whose name starts with "icon",
 * or any .svg used as a mask or as generated content. The fix names the set's class prefix when it is known.
 */
const PROPS = /^(-webkit-)?(background(-image)?|mask(-image)?|content|list-style(-image)?|border-image(-source)?)$/
const URL = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g

function iconSet(ctx) {
  const helpers = ctx.helpers || ctx.profile?.helpers || {}
  const named = helpers['icon-classes'] || helpers['icon-sprite']
  if (named) return named
  const prefix = /(?:^|[\s,{}])\.(icon-|i-)[\w-]+/.exec(ctx.text)?.[1]
  if (prefix) return { prefix }
  if (/@(use|import|forward)\s+['"][^'"]*icon/i.test(ctx.text) || /@include\s+[\w.-]*icon/i.test(ctx.text)) return {}
  return null
}

export default {
  check(ctx) {
    const set = iconSet(ctx)
    if (!set) return
    for (const b of ctx.css())
      for (const d of b.decls) {
        if (!PROPS.test(d.prop)) continue
        for (const m of d.value.matchAll(URL)) {
          const url = m[2]
          if (!/\.svg(\?|#|$)/i.test(url) || url.startsWith('data:')) continue
          const name = url.split(/[?#]/)[0].split('/').pop().replace(/\.svg$/i, '')
          if (!(/(^|\/)icons?\//i.test(url) || /^(icon|ic)[-_]/i.test(name) || /mask|content|list-style/.test(d.prop))) continue
          const use = set.prefix ? `the generated class .${set.prefix}${name.replace(/^(icon|ic)[-_]/i, '')}` : "the icon set's class or mixin"
          ctx.report(d.line, `${d.prop} points at the icon file ${url}; use ${use}, which the build regenerates from the source SVGs.`)
        }
      }
  }
}
