# SEO and metadata reference

Depth for the `fe-seo-metadata` skill. Rule ids in brackets: `frontend-skills explain <id>`. Read on 2026-11-11 from Google Search Central and the framework docs; Lighthouse 13.6.0 SEO category.

## Head of a page

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pricing · Acme</title>
  <meta name="description" content="Plans for teams of every size, with a free tier.">
  <link rel="canonical" href="https://example.com/pricing">
  <link rel="alternate" hreflang="en" href="https://example.com/pricing">
  <link rel="alternate" hreflang="pl" href="https://example.com/pl/cennik">
  <link rel="alternate" hreflang="x-default" href="https://example.com/pricing">
  <meta property="og:title" content="Pricing · Acme">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com/pricing">
  <meta property="og:image" content="https://example.com/img/share-pricing.png">
  <meta property="og:image:alt" content="Three plan cards">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
</head>
```

Google states no length limits for titles and descriptions; long text is cut by pixel width. Provide a non-SVG favicon (ICO or PNG) for Google Search alongside any SVG icon.

## Metadata per framework

| Stack | Title and description | Canonical, robots, hreflang | Sitemap, robots.txt |
| --- | --- | --- | --- |
| Next.js 16 | `export const metadata` / `generateMetadata`; `title.template` in the root layout | `alternates: { canonical, languages }`, `robots` | `app/sitemap.ts`, `app/robots.ts` |
| Nuxt 4 | `useSeoMeta({ title, description, ogImage })`, `titleTemplate` in `app.vue` | `useHead({ link: [{ rel: 'canonical', href }] })` | `@nuxtjs/sitemap`, `@nuxtjs/robots` |
| Astro 7 | Layout `<head>` with props; `Astro.site` for absolute URLs | Same layout | `@astrojs/sitemap` |
| SvelteKit 3 | `<svelte:head>` in `+page.svelte`, data from `load` | Same | A `+server.js` route that returns XML |
| Angular 22 | Route `title`, `Title` and `Meta` services, a custom `TitleStrategy` | `Meta`, `DOCUMENT` for links | A build script or server route |

## Robots [seo/indexable]

| Directive | Effect |
| --- | --- |
| `noindex` | Not shown in results (the page must be crawlable for this to be seen) |
| `nofollow` | Links on the page are not followed |
| `noarchive`, `nosnippet`, `max-snippet:N` | Snippet and cache control |
| robots.txt `Disallow` | Not crawled, but a linked URL may still be indexed without content |

Never use robots.txt to hide private pages: use authentication. Keep `noindex` on staging, search results, cart and account pages.

## Status codes [seo/http-status]

200 for content, 301 or 308 for permanent moves, 302 or 307 for temporary ones, 404 or 410 for gone, 503 with `Retry-After` for maintenance. A single-page app must not show "not found" with status 200.

## Sitemaps

UTF-8 XML, absolute canonical URLs only, at most 50,000 URLs and 50 MB uncompressed per file (use a sitemap index beyond that), listed in robots.txt with `Sitemap: https://example.com/sitemap.xml`. `lastmod` only when it is accurate.

## hreflang [seo/hreflang-valid]

- Codes: ISO 639-1 language, optional script (`zh-Hant`), optional ISO 3166-1 region (`en-GB`, `es-419`); `x-default` for the selector page.
- Every version lists all versions, itself included, with absolute URLs. One method per site: head links, HTTP headers or sitemap entries.

## Structured data [seo/jsonld-valid, seo/jsonld-type-supported]

Still shown by Google (search gallery on 2026-11-11): Article, Breadcrumb (desktop), Carousel (with recipe, course list, restaurant, movie), Course list, Discussion forum, Education Q&A, Employer aggregate rating, Event, Image metadata, Job posting, Local business, Math solver, Movie, Organization, Product and merchant listing, Profile page, Q&A, Recipe, Review snippet, Software app, Speakable, Subscription and paywalled content, Vacation rental, Video. Dataset is used by Dataset Search only.

Retired for rich results: HowTo (2023), FAQ (2026), Course info, Estimated salary, Learning video, Special announcement, Vehicle listing, ClaimReview (2025), Practice problem (2025–2026), Sitelinks search box.

```js
// Serialise safely into HTML
const json = JSON.stringify(data).replace(/</g, '\\u003c')
```

## Social previews [seo/og-absolute-url]

`og:title`, `og:type`, `og:url`, `og:image` (absolute, 1200 × 630 or larger) and `og:image:alt`. Platforms read only server HTML. Twitter/X card markup could not be verified on its official page on 2026-11-11; the Open Graph tags above are what most platforms fall back to.

## llms.txt

A community proposal, not a standard and not a Google ranking signal. Lighthouse 13.3+ has an `llms-txt` audit inside its Agentic Browsing category, which Lighthouse itself labels as under development. Add one only if you want it; never present it as SEO.

## Sources

- Google Search Central documentation: https://developers.google.com/search/docs
- Title links: https://developers.google.com/search/docs/appearance/title-link
- Snippets: https://developers.google.com/search/docs/appearance/snippet
- Canonical URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Localized versions: https://developers.google.com/search/docs/specialty/international/localized-versions
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Search gallery: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- Next.js metadata: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Nuxt SEO and meta: https://nuxt.com/docs/getting-started/seo-meta
- Open Graph protocol: https://ogp.me/
