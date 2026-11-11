/*
 * html/icon-from-set: reports <img> elements whose literal src points to an icon file (a file in an icons or
 * sprites folder, or named icon-* or ic_*) and <use> elements that point into an SVG file (sprite.svg#close),
 * when the project has an icon set. The set is known from the profile (conventions.icons) or seen in the same
 * file: an icon component (<Icon>, <SvgIcon>, <mat-icon>, <iconify-icon>), a <use href="#..."> of an inline sprite,
 * or icon classes (icon-*, fa-*, bi-*, i-*, material-symbols). Without a set nothing is reported. Bound values are
 * left out.
 */
import { classTokens, staticValue } from '../../../engine/helpers.mjs'

const ICON_FILE = /(?:^|\/)(?:icons?|sprites?|svg-icons)\/(?:[^/]+\/)*[^/]+\.(?:svg|png|webp|gif|avif)(?:[?#].*)?$|(?:^|\/)(?:icon|ic)[-_][^/]*\.(?:svg|png|webp|gif|avif)(?:[?#].*)?$/i
const ICON_CLASS = /^(?:icon|fa|bi|ri|mdi|ph|i)-[\w-]+$|^material-(?:icons|symbols)/
const iconName = (src) => (/([^/]+?)\.(?:svg|png|webp|gif|avif)/i.exec(src)?.[1] || 'name').replace(/^(?:icon|ic)[-_]/i, '')

function iconSet(ctx) {
  const icons = ctx.profile?.conventions?.icons
  if (icons) return { component: icons.component, classPrefix: icons.classPrefix, profile: true }
  const all = ctx.elements()
  const comp = all.find((e) => (e.component && /Icon/.test(e.rawName)) || /(?:^|-)icon$/.test(e.name))
  if (comp) return { component: comp.rawName }
  if (all.some((e) => e.name === 'use' && /^#/.test(staticValue(e, 'href') || staticValue(e, 'xlink:href') || ''))) return { sprite: true }
  const cls = all.flatMap(classTokens).find((t) => ICON_CLASS.test(t) && !/^i-$/.test(t))
  if (cls) return { classPrefix: /^(material-\w+)/.exec(cls)?.[1] || cls.replace(/^((?:icon|fa|bi|ri|mdi|ph|i)-).*$/, '$1') }
  return null
}

function hint(set, name) {
  if (set.component) return `<${set.component} name="${name}" />`
  if (set.classPrefix) return `class="${set.classPrefix.endsWith('-') ? set.classPrefix + name : `${set.classPrefix}">${name}`}"`
  return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`
}

export default {
  check(ctx) {
    const set = iconSet(ctx)
    if (!set) return
    for (const el of ctx.elements(['img', 'use'])) {
      if (el.spread) continue
      if (el.name === 'img') {
        const src = staticValue(el, 'src')
        if (!src || !ICON_FILE.test(src.trim())) continue
        ctx.report(el, `<img src="${src}"> hard-codes an icon file; use the project's icon set: ${hint(set, iconName(src))}.`)
      } else if (set.component || set.profile) {
        const href = staticValue(el, 'href') ?? staticValue(el, 'xlink:href')
        if (!href || !/\.svg#/i.test(href)) continue
        ctx.report(el, `<use href="${href}"> hard-codes the sprite file; use ${hint(set, href.split('#')[1].replace(/^icon-/, ''))}.`)
      }
    }
  }
}
