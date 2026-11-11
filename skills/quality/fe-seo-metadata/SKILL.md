---
name: fe-seo-metadata
description: Gets pages found and shared correctly - titles, meta descriptions, canonical URLs, robots and noindex, status codes, sitemaps, hreflang, Open Graph and JSON-LD structured data, with the metadata API of Next.js, Nuxt, Astro, SvelteKit and Angular. Use when adding a page or route, a layout head, social previews, structured data, i18n URLs, or when asked "fix SEO" or "why is this not indexed".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: SEO and metadata
  area: quality
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/robots.txt **/sitemap*.xml"
  rules: "seo/title-unique seo/meta-description seo/canonical-valid seo/indexable seo/http-status seo/hreflang-valid seo/jsonld-valid seo/jsonld-type-supported seo/og-absolute-url a11y/link-is-link"
  version: 0.1.0
---

# SEO and metadata

Read `.frontend-skills/profile.json` (framework, i18n library) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Every page has its own title, topic first and site name last (seo/title-unique).
- Every indexable page has its own meta description (seo/meta-description).
- One absolute `rel="canonical"` per page, without a fragment (seo/canonical-valid).
- No `noindex` on pages that should rank; set robots per environment from configuration (seo/indexable).
- Missing pages return 404, moved pages 301 or 308; no soft 404s (seo/http-status).
- hreflang uses valid codes (`en-GB`, not `en_UK`), absolute URLs, every version listed, plus `x-default` (seo/hreflang-valid).
- JSON-LD is valid JSON with the schema.org context, describes only visible content, and uses supported types (seo/jsonld-valid, seo/jsonld-type-supported).
- Social tags use absolute https URLs for images and URLs (seo/og-absolute-url).
- Links are `<a href>` with real URLs and descriptive text; never script-only links (a11y/link-is-link).
- Metadata, canonical and robots are in the server HTML, not added by client script.
- Never claim a ranking result; say what was fixed and how to verify it in Search Console.

## Do this

1. Find where the head is built: root layout plus per-route metadata (Next.js `metadata`/`generateMetadata`, Nuxt `useSeoMeta`, Astro layout props, SvelteKit `<svelte:head>`, Angular `Title`/`Meta` and route `title`).
2. Set defaults once in the root layout (site name template, Open Graph defaults, canonical origin from config); override per route.
3. Generate `sitemap.xml` and `robots.txt` from the routes (Next.js `app/sitemap.ts` and `app/robots.ts`, `@astrojs/sitemap`, `@nuxtjs/sitemap`), with canonical URLs only.
4. For multilingual sites, generate hreflang from the i18n configuration, and keep `<html lang>` equal to the page language.
5. Add structured data as an object serialised with `JSON.stringify` (escape `<`), only for types in Google's current gallery.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds missing descriptions in documents, bad canonicals, invalid hreflang, broken JSON-LD, retired rich-result types, relative social URLs and script-only links.
- `audit --url <page>` runs Lighthouse SEO (crawlable, status code, title, description, link text, hreflang, canonical).
- By hand: view the page source (not the DOM) for title, description, canonical and robots; test structured data with the Rich Results Test; inspect a URL in Search Console.

## References

- [references/seo.md](references/seo.md): metadata per framework, robots directives, sitemap limits, hreflang sets, structured data types still supported, social tags, llms.txt status. Read it when building a layout head or a multilingual site.
