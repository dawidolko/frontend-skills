/*
 * css/asset-url: the CSS half of the asset rule, for projects built by a bundler or framework (the rule's stack).
 * It reports url() values that are root paths (/images/a.png) or point into a public/ folder, because such a file
 * is copied as-is without a content hash and, in some frameworks (Next.js basePath), not given the base path.
 * Relative paths, aliases (@/, ~/), root paths into /src/ (which Vite resolves from the project root and hashes),
 * data: and blob: URLs, fragments, full URLs and variables are left alone. Icon files are left to css/icon-from-set
 * when the profile names an icon set.
 */
const URL = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g

export default {
  check(ctx) {
    const helpers = ctx.helpers || ctx.profile?.helpers || {}
    const icons = Boolean(helpers['icon-classes'] || helpers['icon-sprite'])
    for (const b of ctx.css())
      for (const d of b.decls)
        for (const m of d.value.matchAll(URL)) {
          const url = m[2].trim()
          const root = url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/src/')
          if (!root && !/(^|\/)public\//.test(url)) continue
          if (icons && /\.svg(\?|#|$)/i.test(url) && /icon/i.test(url)) continue
          ctx.report(
            d.line,
            `url(${url}) is a hard-coded path to a public file: it gets no content hash, and not every framework adds the base path to it; use a path relative to this file or the project's asset alias.`
          )
        }
  }
}
