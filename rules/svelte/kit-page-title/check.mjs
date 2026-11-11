/*
 * svelte/kit-page-title: a project check over the +page.svelte files of src/routes. It reports a page with no
 * <title>, no component that receives a title prop and no SEO/Head/Meta component, unless a +layout.svelte above
 * it renders a <title> with an expression (a title from page data) or a metadata component. An empty page and a
 * page whose markup is one wrapper component (which may set the title) are left out. Layouts are read by path.
 */
const PAGE = /(?:^|\/)src\/routes\/(?:.*\/)?\+page(?:@[^/]*)?\.svelte$/
const HAS_TITLE = /<title[\s>]|<[A-Z][\w.]*\b[^>]*\btitle\s*=|<[A-Z][\w.]*\b[^>]*\{title\}|<(?:[\w.]*(?:Seo|SEO|Head|Meta)[\w.]*)[\s/>]/

function layoutsAbove(file) {
  const parts = file.split('/')
  const routes = parts.lastIndexOf('routes')
  const out = []
  for (let i = parts.length - 1; i > routes; i--) out.push(`${parts.slice(0, i).join('/')}/+layout.svelte`)
  return out
}

export default {
  check(ctx) {
    for (const f of ctx.files) {
      if (f.kind !== 'svelte' || !PAGE.test(f.path)) continue
      const text = ctx.read(f.path)
      if (HAS_TITLE.test(text)) continue
      const markup = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/g, '').trim()
      if (!markup || /^<([A-Z][\w.]*)\b[\s\S]*(?:\/>|<\/\1\s*>)$/.test(markup) && !/^<([A-Z][\w.]*)\b[^>]*\/>\s*</.test(markup)) continue
      const fromData = layoutsAbove(f.path).some((l) => {
        const layout = ctx.read(l)
        return /<title[^>]*>[^<]*\{[^}]+\}[^<]*<\/title>/.test(layout) || /<(?:[\w.]*(?:Seo|SEO|Head|Meta)[\w.]*)[\s/>]/.test(layout)
      })
      if (!fromData) ctx.report({ file: f.path, line: 1 }, 'This page sets no <title>; add <svelte:head><title>…</title></svelte:head> so the route announcement and tab name the page.')
    }
  }
}
