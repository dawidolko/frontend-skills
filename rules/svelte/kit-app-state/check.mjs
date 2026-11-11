/*
 * svelte/kit-app-state: reports imports from '$app/stores' (static or dynamic) in Svelte and JavaScript files of a
 * SvelteKit project. It does nothing when the profile names a SvelteKit version below 2, which has no $app/state.
 */
import { findInRaw } from '../../js/source.mjs'

function kitMajor(profile) {
  for (const p of profile?.projects || []) {
    const v = p.frameworks?.sveltekit || p.frameworks?.['@sveltejs/kit']
    if (v) return Number.parseInt(String(v).replace(/^[^\d]*/, ''), 10)
  }
  return null
}

export default {
  check(ctx) {
    const major = kitMajor(ctx.profile)
    if (major !== null && major < 2) return
    for (const f of findInRaw(ctx, /(?:\bfrom\s*|\bimport\s*\(\s*)(["'])\$app\/stores\1/g))
      ctx.report(ctx.lineOf(f.index), "Import page, navigating and updated from '$app/state' (no $ prefix); $app/stores is removed in SvelteKit 3.")
  }
}
