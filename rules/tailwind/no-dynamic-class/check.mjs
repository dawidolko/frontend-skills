/*
 * tailwind/no-dynamic-class: reports a class attribute (className, :class, [class], [ngClass], Svelte and Astro
 * expressions) that builds a Tailwind utility from a fragment, such as `bg-${color}`, 'text-' + size,
 * bg-{color}-500 or bg-{{ color }}. Only fragments that start like a Tailwind utility are read, so a component's
 * own CSS classes built the same way (btn-${variant}) are left out.
 */
const ROOTS = [
  'bg',
  'text',
  'border',
  'border-[trblxyse]',
  'ring',
  'outline',
  'fill',
  'stroke',
  'from',
  'via',
  'to',
  'shadow',
  'decoration',
  'accent',
  'caret',
  'divide',
  'placeholder',
  'p[xytrblse]?',
  'm[xytrblse]?',
  'w',
  'h',
  'size',
  'min-w',
  'min-h',
  'max-w',
  'max-h',
  'gap',
  'gap-[xy]',
  'space-[xy]',
  'grid-cols',
  'grid-rows',
  'col-span',
  'row-span',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'inset-[xy]',
  'z',
  'opacity',
  'rounded',
  'rounded-[trblse]{1,2}',
  'font',
  'leading',
  'tracking',
  'translate-[xy]',
  'rotate',
  'scale',
  'order',
  'basis',
  'columns',
  'aspect',
  'line-clamp',
  'duration',
  'delay',
  'blur',
  'col-start',
  'col-end',
  'row-start',
  'row-end'
]
const FRAGMENT = new RegExp(`(?:^|[\\s"'\`{(?:])(?:[\\w-]+:)*-?(?:${ROOTS.join('|')})-(?:\\$\\{|\\{|["'\`]\\s*\\+)`)

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      for (const name of ['class', 'ngclass']) {
        const a = el.attrs.get(name)
        if (!a?.dynamic) continue
        if (!FRAGMENT.test(a.value)) continue
        ctx.report(a.line, `Tailwind cannot see a class built from parts ("${a.value.slice(0, 40)}"); map each case to a complete class.`)
        break
      }
    }
  }
}
