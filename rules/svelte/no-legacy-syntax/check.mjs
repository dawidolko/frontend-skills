/*
 * svelte/no-legacy-syntax: reports Svelte 4 syntax in a Svelte file: export let, $: statements, $$props and
 * $$restProps in the script; on:event directives, <slot> and <svelte:component> in the markup. It does nothing
 * when the project profile names a Svelte version below 5.
 */
import { findInCode } from '../../js/source.mjs'

function svelteMajor(profile) {
  for (const p of profile?.projects || []) {
    const v = p.frameworks?.svelte
    if (v) return Number.parseInt(String(v).replace(/^[^\d]*/, ''), 10)
  }
  return null
}

function depthAt(code, at) {
  let d = 0
  for (let i = 0; i < at; i++) {
    if ('{(['.includes(code[i])) d++
    else if ('})]'.includes(code[i])) d--
  }
  return d
}

const SCRIPT = [
  [/(?<![\w$.])export\s+let\s/g, 'export let is Svelte 4 syntax; use let { name } = $props().'],
  [/(?:^|[;}\n])[ \t]*\$:/g, '$: is Svelte 4 syntax; use $derived, or an event handler for side effects.'],
  [/\$\$(?:props|restProps)\b/g, '$$props and $$restProps are Svelte 4 syntax; use let { a, ...rest } = $props().']
]

export default {
  check(ctx) {
    const major = svelteMajor(ctx.profile)
    if (major !== null && major < 5) return
    for (const [re, message] of SCRIPT)
      for (const f of findInCode(ctx, re)) {
        if (message.startsWith('$:') && depthAt(f.code, f.match.index) !== 0) continue
        ctx.report(ctx.lineOf(f.index + f.match[0].search(/\S/)), message)
      }
    for (const el of ctx.elements()) {
      if (el.name === 'slot') ctx.report(el, '<slot> is Svelte 4 syntax; render a snippet with {@render children?.()}.')
      if (el.name === 'svelte:component') ctx.report(el, '<svelte:component> is not needed in Svelte 5; render the component variable directly.')
      for (const a of el.attrs.values())
        if (/^on:/.test(a.raw)) ctx.report(a.line, `${a.raw.split('|')[0]} is Svelte 4 syntax; use ${a.raw.split('|')[0].replace(':', '')}={...}.`)
    }
  }
}
