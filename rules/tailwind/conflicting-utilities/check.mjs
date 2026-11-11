/*
 * tailwind/conflicting-utilities: reports a literal class list that holds two different utilities of one group
 * under the same variants: display (block, flex, grid, hidden...), position, padding and margin per side, width,
 * height, size, gap, z-index, opacity, font weight, font size, flex direction, align and justify, rounded. text-base
 * is left out of the font sizes because projects often name a colour "base" (--color-base). A
 * bound class list (a ternary, clsx) is not read.
 */
import { literalClasses, splitClass } from '../tw.mjs'

const SETS = {
  display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden', 'contents', 'table', 'flow-root', 'list-item'],
  position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
  'font-weight': ['font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'],
  'text-size': ['text-xs', 'text-sm', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'],
  direction: ['flex-row', 'flex-col', 'flex-row-reverse', 'flex-col-reverse'],
  items: ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch'],
  justify: ['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly', 'justify-stretch', 'justify-normal']
}
const BY_TOKEN = new Map()
for (const [group, list] of Object.entries(SETS)) for (const t of list) BY_TOKEN.set(t, group)
const PREFIXES = [
  'min-w',
  'min-h',
  'max-w',
  'max-h',
  'gap-x',
  'gap-y',
  'size',
  'gap',
  'opacity',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'ps',
  'pe',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'ms',
  'me',
  'p',
  'm',
  'w',
  'h',
  'z'
]
const PREFIX = new RegExp(`^-?(${PREFIXES.join('|')})-(?!\\(|\\[--)`)

function group(utility) {
  if (BY_TOKEN.has(utility)) return BY_TOKEN.get(utility)
  if (/^rounded(?:-(?:none|xs|sm|md|lg|xl|2xl|3xl|4xl|full))?$/.test(utility)) return 'rounded'
  const m = PREFIX.exec(utility)
  return m ? m[1] : null
}

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const cls = literalClasses(el)
      if (!cls || cls.length < 2) continue
      const seen = new Map()
      for (const c of cls) {
        const { variants, utility } = splitClass(c)
        const g = group(utility)
        if (!g) continue
        const key = `${variants}|${g}`
        const prev = seen.get(key)
        if (prev && prev !== c) {
          ctx.report(el, `"${prev}" and "${c}" set the same property; keep one (the winner depends on CSS order, not class order).`)
          break
        }
        seen.set(key, c)
      }
    }
  }
}
