/*
 * perf/css-no-import: in a plain HTML site (stack "html") that the profile does not show to be bundled (no vite,
 * webpack or framework build), reports @import in shipped .css files and in <style> blocks, which loads stylesheets
 * one after another. @import "tailwindcss" and Sass or Less sources are left alone.
 */
const BUNDLED = ['vite', 'webpack', 'tailwind', 'next', 'nuxt', 'astro', 'sveltekit', 'angular']

export default {
  check(ctx) {
    if ((ctx.profile?.stack || []).some((s) => BUNDLED.includes(s))) return
    const re = /@import\s+(url\(\s*)?['"]?([^'"\s);]+)/g
    const text = ctx.text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    for (const m of text.matchAll(re)) {
      if (/^tailwindcss/.test(m[2])) continue
      if (ctx.kind === 'html' && !/<style[\s>]/i.test(text.slice(0, m.index))) continue
      ctx.report(ctx.lineOf(m.index), `@import "${m[2]}" is fetched only after this stylesheet is parsed; use a <link rel="stylesheet"> or combine the files.`)
    }
  }
}
