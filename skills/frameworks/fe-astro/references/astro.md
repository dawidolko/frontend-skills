# Astro reference

Depth for the `fe-astro` skill, for Astro 7 (latest stable checked 2026-11-11 on the npm registry: 7.4.10; Vite 8). Rule ids in brackets: `frontend-skills explain <id>`.

## Changes from Astro 6 that developers still hit

| Change | What to do |
| --- | --- |
| The Rust compiler is the only compiler | Unclosed tags are errors; invalid nesting (`<div>` inside `<p>`) is no longer repaired, so fix the markup |
| `compressHTML` defaults to `'jsx'` | Whitespace between inline elements is removed; add `{" "}` where a space matters, or set `compressHTML: true` |
| `src/fetch.ts` is reserved for advanced routing | Rename a file of yours with that name, or set `fetchFile` |
| Markdown renders with Sätteri by default | remark and rehype plugins need `@astrojs/markdown-remark` and `unified()` |
| Vite 8 | Update Vite plugins to versions that support it |

## Client directives [astro/static-by-default]

| Directive | Hydrates | Use for |
| --- | --- | --- |
| none | never; HTML only | anything that only displays data |
| `client:load` | at once | interactive UI needed immediately above the fold |
| `client:idle` | when the main thread is idle | lower-priority UI |
| `client:visible` | when it enters the viewport (`{{ rootMargin: '200px' }}` to start early) | content further down the page |
| `client:media="(max-width: 50em)"` | when the media query matches | UI that exists only at some widths |
| `client:only="react"` | in the browser only, never rendered on the server | components that cannot render on the server; always name the framework and add `slot="fallback"` [astro/client-only-framework] |

Directives work only on UI framework components imported directly into the `.astro` file, written literally on the element (not inside a spread, not on dynamic tags) [astro/directive-on-framework-component].

## Server islands [astro/server-defer-fallback]

- `server:defer` renders the component in a later request, so the page itself can be cached and prerendered. It needs an adapter.
- Add a child with `slot="fallback"` of the same size; it is shown until the island arrives.
- Props are encrypted into the request URL: pass ids and small values. Functions cannot be passed; above 2,048 bytes Astro switches to an uncached POST.

## Scripts [astro/script-processed]

| Script tag | Result |
| --- | --- |
| `<script>` or `<script src="../x.ts">` | Bundled, TypeScript, npm imports, deduplicated, output as a module |
| `<script is:inline>` | Copied as written, once per component instance, no TypeScript, no imports |
| any other attribute (`type`, `async`, `define:vars`) | Treated as `is:inline` |
| `<script type="application/ld+json" set:html={JSON.stringify(data)} />` | Structured data; fine |

Pass server values to processed scripts with `data-*` attributes and `element.dataset`, or a custom element that reads its own attributes.

## Images [js/asset-import]

| Source | Use |
| --- | --- |
| `src/assets/hero.jpg` | `import hero from '../assets/hero.jpg'` then `<Image src={hero} alt="…" />`: optimised, sized, no layout shift |
| Several formats or art direction | `<Picture src={hero} formats={['avif', 'webp']} alt="…" />` |
| LCP image | add `priority` (eager loading, high fetch priority) |
| Remote image | allow the host in `image.domains` or `image.remotePatterns` |
| `public/` file | not optimised; give `width` and `height`, and build the path with `import.meta.env.BASE_URL` |
| Markdown images | relative paths to `src/` files are optimised too |

`alt` is required on `<Image>` and `<Picture>`; `alt=""` for decorative images.

## Environment variables and security [astro/public-env-secret]

| Need | Use |
| --- | --- |
| A value for client code | `PUBLIC_` prefix, or `envField.string({ context: 'client', access: 'public' })` from `astro:env/client` |
| A server-only value | `envField.string({ context: 'server', access: 'public' })` from `astro:env/server` |
| A secret | `envField.string({ context: 'server', access: 'secret' })`; never in client code |
| Raw HTML | `set:html` only with trusted or sanitized HTML; `set:text` and `{value}` are escaped |
| Form posts on on-demand pages | keep `security.checkOrigin` on (default); set `security.allowedDomains` behind a proxy |
| CSP | `security.csp` hashes scripts and styles; it does not work with `<ClientRouter />` or in dev |

## Rendering and navigation

- Prerendered by default; `export const prerender = false` per route, or `output: 'server'` for mostly dynamic sites (adapter required).
- `<ClientRouter />` gives view transitions; it respects `prefers-reduced-motion` and announces the new page's `<title>`, so every page needs a unique one.
- Prefetch likely next links with `data-astro-prefetch` (default strategy `hover`).

## Sources

- Upgrade to Astro v7: https://docs.astro.build/en/guides/upgrade-to/v7/
- Template directives reference: https://docs.astro.build/en/reference/directives-reference/
- Islands architecture: https://docs.astro.build/en/concepts/islands/
- Server islands: https://docs.astro.build/en/guides/server-islands/
- Scripts and event handling: https://docs.astro.build/en/guides/client-side-scripts/
- Images: https://docs.astro.build/en/guides/images/
- astro:assets reference: https://docs.astro.build/en/reference/modules/astro-assets/
- Environment variables: https://docs.astro.build/en/guides/environment-variables/
- Configuration reference: https://docs.astro.build/en/reference/configuration-reference/
- On-demand rendering: https://docs.astro.build/en/guides/on-demand-rendering/
- View transitions: https://docs.astro.build/en/guides/view-transitions/
- Prefetch: https://docs.astro.build/en/guides/prefetch/
- Content collections: https://docs.astro.build/en/guides/content-collections/
- CLI reference (astro check): https://docs.astro.build/en/reference/cli-reference/
