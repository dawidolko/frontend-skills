/*
 * html/project-icons: in projects whose profile records icons built into CSS classes (helper "icon-classes"),
 * reports an <img> whose literal src is an SVG from the icon source folder (or any "icons" folder), and names the
 * generated class to use instead.
 */
import { staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    const h = ctx.helpers['icon-classes']
    const folder = (h.sourceDir || 'icons').split('/').pop()
    const re = new RegExp(`(^|/)${folder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([\\w-]+)\\.svg$`, 'i')
    for (const el of ctx.elements('img')) {
      const m = re.exec(staticValue(el, 'src') || '')
      if (m) ctx.report(el, `This icon is an image file; use the generated class ${h.prefix ? `"${h.prefix}${m[2]}"` : 'of the icon build'} with aria-hidden="true".`)
    }
  }
}
