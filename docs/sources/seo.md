# SEO and metadata: sources and candidate rules

Read on 2026-11-11. Primary sources:

- Google Search Central documentation: https://developers.google.com/search/docs
  - Title links: https://developers.google.com/search/docs/appearance/title-link
  - Snippets / meta description: https://developers.google.com/search/docs/appearance/snippet
  - Canonicalisation: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
  - Robots meta tag and X-Robots-Tag: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
  - robots.txt intro: https://developers.google.com/search/docs/crawling-indexing/robots/intro ; Google's robots.txt spec now lives at https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec
  - Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
  - Localised versions (hreflang): https://developers.google.com/search/docs/specialty/international/localized-versions
  - Structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
  - Structured data search gallery: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
  - Crawlable links: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
  - JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
  - Image SEO: https://developers.google.com/search/docs/appearance/google-images
  - Mobile-first indexing: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
  - HTTP status codes: https://developers.google.com/crawling/docs/troubleshooting/http-status-codes
  - Favicon: https://developers.google.com/search/docs/appearance/favicon-in-search
  - AI features: https://developers.google.com/search/docs/appearance/ai-features
  - AI optimisation guide (mythbusting, llms.txt): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide#mythbusting
  - Documentation changelog: https://developers.google.com/search/updates
  - Blog: HowTo/FAQ changes (2023): https://developers.google.com/search/blog/2023/08/howto-faq-changes ; simplifying results (2025): https://developers.google.com/search/blog/2025/06/simplifying-search-results , https://developers.google.com/search/blog/2025/11/update-on-our-efforts
- schema.org (latest release 30.1, 2026-09-16): https://schema.org/docs/releases.html
- Open Graph protocol: https://ogp.me/
- Lighthouse default config (category and audit ids, `main` branch): https://github.com/GoogleChrome/lighthouse/blob/main/core/config/default-config.js ; releases (latest v13.6.0, 2026-10-27): https://github.com/GoogleChrome/lighthouse/releases
- Web app manifest: MDN https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest , installability https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable , spec https://w3c.github.io/manifest/
- llms.txt proposal: https://llmstxt.org/

## Lighthouse SEO category today (v13.6.0, `main` default-config.js)

Audit ids in the `seo` category, all confirmed present: `is-crawlable` (group seo-crawl, weight 93/23), `document-title`,
`meta-description`, `http-status-code`, `link-text`, `crawlable-anchors`, `robots-txt`, `image-alt`, `hreflang`,
`canonical` (each weight 1), and `structured-data` (manual, weight 0). Older ids such as `viewport`, `font-size`,
`tap-targets`, `plugins` are not in the SEO category any more (they are absent from the current config's `seo` auditRefs).

A fifth category `agentic-browsing` exists in the default config (added in 13.2/13.3, described in the config as still
under development): `agent-accessibility-tree`, `webmcp-form-coverage`, `webmcp-registered-tools`,
`webmcp-schema-validity`, `cumulative-layout-shift`, `llms-txt`, `ard-schema`. It is not part of the SEO score.
Release notes: 13.0.2 added `Content-Signal` directive support to `robots-txt`; 13.6.0 added a `License` directive.

## Titles, descriptions, canonical

Severity in column `sev`.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/title-present | Every indexable page has exactly one non-empty `<title>` in `<head>`. | Google's first source for the title link; screen readers announce it too. | Google title links, https://developers.google.com/search/docs/appearance/title-link | any | static: no `<title>` / empty / more than one; runtime: Lighthouse `document-title` | `<head>` without title → `<title>Blue trail shoes – Shop</title>` | – | error |
| seo/title-unique | Each page's title describes that page and differs from other pages' titles. | Identical or boilerplate titles make pages indistinguishable and Google rewrites them. | same, "unique titles", "avoid boilerplate" | any | static (framework route files with identical literal title); runtime crawl for duplicates | all routes `title: "Shop"` → per-route title from data | – | warning |
| seo/title-no-stuffing | Keep the title short and descriptive without repeated keywords; site name once at start or end with a separator. | Keyword stuffing and long site-wide suffixes get rewritten; no character limit is stated, titles are truncated to device width. | same, "avoid keyword stuffing", "brand your titles concisely" | any | manual (static heuristic: same word ≥3 times) | `Shoes, shoes, cheap shoes` → `Trail running shoes – Brand` | – | info |
| seo/title-lang-match | Write the title in the same language and script as the page content. | Google may replace a mismatched title. | same, "match the title to the page language" | any | manual / runtime (compare with `lang`) | English title on Polish page → Polish title | – | info |
| seo/meta-description | Give important pages a unique `<meta name="description">` summarising that page. | Google may use it for the snippet when it is more accurate than page text; no length limit is stated, truncation is to device width. Not a ranking guarantee. | Google snippets, https://developers.google.com/search/docs/appearance/snippet | any | static: missing/empty/duplicated literal; runtime: Lighthouse `meta-description` | same description on every page → page-specific summary | – | warning |
| seo/canonical-valid | If present, `rel=canonical` is a single absolute URL, in `<head>`, without a fragment, and points to an indexable page. | Relative, multiple, fragment or off-`<head>` canonicals are ignored or misread. | Google canonicalisation, https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls | any | static: `<link rel=canonical>` count >1, relative href, `#` in href; runtime: Lighthouse `canonical` | `href="/p"` → `href="https://example.com/p"` | – | error |
| seo/canonical-self | The canonical page carries a self-referencing canonical, and sitemap URLs equal canonical URLs. | Conflicting signals (sitemap vs link) let Google pick another URL. | same, "avoid mistakes" | any | runtime crawl / static compare sitemap vs routes | sitemap lists `?ref=` URL → canonical URL only | – | warning |
| seo/canonical-not-robots | Do not use robots.txt disallow or `noindex` to pick a canonical. | Disallowed URLs can still be indexed without content; `noindex` is the wrong signal for duplicates. | same | any | static: robots.txt disallow on parameter variants + no canonical | robots disallow `/*?sort=` → canonical to clean URL | – | warning |
| seo/canonical-js | Put the canonical in server HTML; if JS changes it, JS must not produce a different value from the HTML. | Google uses the rendered value but conflicting values are unreliable. | JavaScript SEO basics, https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics ; changelog 2025-12-17 | SPA frameworks | runtime: compare raw vs rendered HTML | client-only `<link rel=canonical>` differing from SSR → set once in SSR head | – | warning |

## Crawling and indexing: robots, sitemaps, status codes

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/no-accidental-noindex | Production pages that should rank must not carry `noindex` (meta or `X-Robots-Tag`). | Removes the page from results; common leftover from staging. | Google robots meta, https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag | any | static: `<meta name=robots content=*noindex*>` in prod templates; runtime: Lighthouse `is-crawlable` | staging meta shipped to prod → env-gated | – | error |
| seo/noindex-not-blocked | A URL meant to be de-indexed must be crawlable (not disallowed in robots.txt) so the `noindex` is seen. | Robots.txt-blocked URLs never show their meta/header rules. | same, "combining with robots.txt" | any | static: path both disallowed and `noindex` | disallow + noindex → allow crawl + noindex | – | warning |
| seo/noindex-not-via-js | Do not rely on adding or removing `noindex` with JavaScript; ship the intended value in the initial HTML. | Google may skip rendering when it sees `noindex`; JS-dependent behaviour is undefined (changelog 2025-12-15). | JavaScript SEO basics; changelog https://developers.google.com/search/updates | SPA | static: `noindex` toggled in client code | SSR `noindex` then removed in JS → correct value server-side | – | warning |
| seo/robots-meta-in-head | Place robots meta in `<head>`, even though Google also reads it in `<body>`. | Other crawlers and tools may not; Google notes body placement is tolerated (changelog 2026-03-24). | robots meta tag doc | any | static | meta robots in body → head | – | info |
| seo/robots-txt-valid | Serve a valid `/robots.txt` (200, plain text) that does not disallow CSS/JS needed to render, and list sitemaps with absolute `Sitemap:` lines. | Blocking render resources hurts understanding; invalid lines are ignored; robots.txt does not keep pages out of the index. | robots.txt intro, https://developers.google.com/search/docs/crawling-indexing/robots/intro ; spec https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec | any | static: parse file; runtime: Lighthouse `robots-txt` | `Disallow: /assets/` → remove; add `Sitemap: https://example.com/sitemap.xml` | – | warning |
| seo/robots-not-for-privacy | Never use robots.txt to hide private pages; use auth or `noindex`. | Disallowed URLs can still appear in results if linked; the file is public. | robots.txt intro | any | manual | `Disallow: /admin` as protection → auth | – | warning |
| seo/sitemap-valid | Sitemap is UTF-8, absolute canonical URLs only, ≤50,000 URLs and ≤50 MB uncompressed per file (use an index above that), `lastmod` only when accurate. | Google ignores `priority` and `changefreq`; inaccurate `lastmod` is ignored. | Build a sitemap, https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap | any | static: parse XML, count, check absolute URLs | `<priority>` everywhere, relative URLs → absolute canonical URLs, real `lastmod` | – | warning |
| seo/http-status-meaningful | Return real status codes: 404/410 for missing, 301/308 for permanent moves, 5xx/503 for outages; not 200 for errors. | Google treats 200 error pages as soft 404; 301/308 are strong canonical signals, 302/307 weak; up to 10 redirect hops followed; 429 treated like a server error. | Google HTTP status codes, https://developers.google.com/crawling/docs/troubleshooting/http-status-codes | server / SSR / hosting config | runtime: Lighthouse `http-status-code` (fails on 4xx/5xx of the audited page); crawl | catch-all route returning 200 "Not found" → 404 | – | error |
| seo/spa-soft-404 | In a client-rendered app, an error view either redirects to a URL that returns 404 or injects `noindex`. | Otherwise every unknown path is a 200 soft 404. | JavaScript SEO basics, "avoid soft 404 errors in SPAs" | React/Vue/Svelte/Angular SPA | static: router catch-all without status/noindex handling | `path:'*'` → NotFound (200) → SSR 404 or `noindex` meta | – | warning |
| seo/non-200-not-rendered | Do not depend on JS-rendered content on non-200 pages. | Non-200 pages may not be sent to rendering (changelog 2025-12-18). | JavaScript SEO basics | SPA | manual | – | – | info |

## Links, rendering, JavaScript

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/crawlable-anchor | Navigation uses `<a href="real-url">`; not `<a>` without `href`, `onclick`-only, `routerLink`-only, `<span href>` or `href="javascript:…"`. | Google cannot reliably extract URLs from those. | Crawlable links, https://developers.google.com/search/docs/crawling-indexing/links-crawlable | any (check custom link components render a real `href`) | static: `<a>` without href, `href="javascript:`, `href="#"` + onclick; runtime: Lighthouse `crawlable-anchors` | `<span onclick=go('/x')>` → `<a href="/x">` | – | error |
| seo/link-text-descriptive | Link text describes the destination; avoid "click here"/"read more"; image links use descriptive `alt`. | Anchor text is a relevance signal; empty text is bad; also an a11y issue (WCAG 2.4.4). | same, "anchor text placement / write good anchor text" | any | runtime: Lighthouse `link-text`; static list of generic phrases | `Read more` → `Read more about pricing` | – | warning |
| seo/history-routing | Client routes use the History API and real paths, not `#/` fragments. | Fragments are not reliably resolved by Googlebot. | JavaScript SEO basics | SPA | static: hash router config (`createWebHashHistory`, `HashRouter`, `useHash: true`) | `/#/products` → `/products` | – | warning |
| seo/ssr-or-prerender-content | Primary content and metadata are in server HTML (SSR/SSG/prerender) where possible. | Rendering is deferred and may fail; other crawlers and social scrapers often do not run JS. | JavaScript SEO basics (recommends SSR or prerendering) | SPA | runtime: compare raw HTML vs rendered | empty `<div id=root>` → SSR/SSG | – | info |
| seo/fingerprint-assets | Use content-hashed file names for JS/CSS. | Googlebot caches aggressively and may ignore cache headers. | JavaScript SEO basics, "use long-lived caching" | bundlers | static: build config output names | `app.js` → `app.3f9c1.js` (default in Vite/Next) | – | info |
| seo/shadow-dom-content | Content that must be indexed must appear in the rendered (flattened) DOM; use slots for light-DOM content. | Google flattens shadow and light DOM; only rendered content counts. | JavaScript SEO basics, "web components" | web components | manual / runtime | – | – | info |
| seo/no-interaction-to-load | Primary content must not need clicking, swiping or typing to load. | Google does not trigger interactions (mobile-first indexing). | Mobile-first indexing, https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing | any | manual / runtime | "Load more" button for main article → render or paginate with links | – | warning |

## Mobile-first parity

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/mobile-parity | Mobile and desktop serve the same primary content, headings, structured data, title, description, robots meta and alt text. | Google indexes the mobile version; content missing on mobile is lost. | Mobile-first indexing | responsive / dynamic serving | static: content hidden only via `display:none` at small breakpoints for main text (heuristic); manual | desktop-only product specs → same content, tabs/accordion on mobile | – | warning |
| seo/viewport-meta | Include `<meta name="viewport" content="width=device-width, initial-scale=1">`. | Basis of mobile rendering (no longer a Lighthouse SEO audit; rule lives in responsive/a11y). | Mobile-first indexing (general); see responsive file | any | static | missing → add | – | warning |

## Structured data

Google recommends JSON-LD (Microdata/RDFa equally accepted); JSON-LD injected by JS is read; markup must describe visible
content; validate with the Rich Results Test. Source: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

Rich result features in Google's search gallery today (25): Article, Breadcrumb, Carousel (only with Recipe, Course list,
Restaurant or Movie), Course list, Dataset (changelog 2025-11-05: used only by Dataset Search, not Google Search),
Discussion forum, Education Q&A, Employer aggregate rating, Event, Image metadata, Job posting, Local business, Math
solver, Movie, Organization, Product (incl. merchant listing, product variants), Profile page, Q&A, Recipe, Review snippet,
Software app, Speakable, Subscription and paywalled content, Vacation rental, Video.
Source: https://developers.google.com/search/docs/appearance/structured-data/search-gallery

Deprecated / no longer shown (do not add for rich results; existing markup is harmless):
- HowTo: no longer shown since 2023-09-13 (https://developers.google.com/search/blog/2023/08/howto-faq-changes).
- FAQ (FAQPage): limited to authoritative government/health sites in Aug 2023; feature ended 2026-05-07, docs removed 2026-06-15 (https://developers.google.com/search/updates).
- Course info, Estimated salary, Learning video, Special announcement, Vehicle listing, ClaimReview: retirement announced June 2025, docs removed 2025-09-09 (https://developers.google.com/search/blog/2025/06/simplifying-search-results , changelog).
- Practice problem: phased out 2025-11-05, docs removed 2026-01-06.
- Sitelinks search box: removed (https://developers.google.com/search/blog/2024/10/sitelinks-search-box).
- Book actions: deprecation banner removed 2025-11-05; still a feature (not in the general gallery list).
- Breadcrumb rich results are desktop-only (changelog 2025-01-22).

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/jsonld-valid | JSON-LD blocks parse as JSON, use `@context: "https://schema.org"` and a schema.org type. | Invalid JSON is dropped silently. | Google structured data intro; schema.org | any | static: parse every `<script type="application/ld+json">` | trailing comma → valid JSON | – | error |
| seo/jsonld-matches-visible | Structured data describes only content visible on the page. | Markup about invisible content violates Google's guidelines and can lead to a manual action. | same, "guidelines" | any | manual | hidden `aggregateRating` → only shown ratings | – | warning |
| seo/jsonld-supported-type | Use rich-result types from Google's current gallery; flag HowTo/FAQPage/ClaimReview/SpecialAnnouncement/etc. as "no rich result in Google". | Effort on retired types brings no rich result. | search gallery; changelog | any | static: `@type` against list above | `FAQPage` for rich result → keep only if needed elsewhere | – | info |
| seo/jsonld-required-props | Include the properties Google marks as required for the chosen feature (per feature page). | Missing required props make the item ineligible. | per-feature docs, e.g. https://developers.google.com/search/docs/appearance/structured-data/article | any | runtime: Rich Results Test (manual tool, no public API); static per-type checklist | `Product` without `name`/`offers`/`review`/`aggregateRating` → add | – | warning |
| seo/organization-logo | Home page has `Organization` (or subtype) markup with `logo`, `url`, `name`. | Feeds knowledge panel / logo. | Organization doc in gallery | any | static | – | – | info |

Lighthouse `structured-data` is a manual audit only (weight 0): it does not validate.

## Internationalised SEO (hreflang)

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/hreflang-valid-codes | `hreflang` values are an ISO 639-1 language with optional ISO 3166-1 alpha-2 region (or script, e.g. `zh-Hant`), or `x-default`; never region alone; `GB` not `UK`. | Invalid codes are ignored; Google ignores `EU`, `UN`, `UK`; `es-419` not supported by Google. | Google localized versions, https://developers.google.com/search/docs/specialty/international/localized-versions | any | static; runtime: Lighthouse `hreflang` | `hreflang="uk"` (meaning UK) → `en-GB` | – | error |
| seo/hreflang-reciprocal | Every language version lists itself and all others with the same set, using absolute URLs. | Missing return links make Google ignore the annotations. | same | any | static across locale routes / sitemap | page A→B only → A↔B + self | – | error |
| seo/hreflang-one-method | Use one method (head links, HTTP `Link` header, or sitemap `xhtml:link`), not several. | Extra methods add maintenance without benefit. | same | any | static | – | – | info |
| seo/hreflang-x-default | Provide `x-default` for language pickers or auto-redirecting entry pages. | Fallback for unmatched users. | same | any | static | – | – | info |

Google does not use `hreflang` or the HTML `lang` attribute to detect page language (same page); keep `lang` for
accessibility and rendering (see i18n.md).

## Images

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/img-element-for-content | Content images use `<img src>` (with `srcset`/`<picture>` fallback `img`), not CSS backgrounds. | Google does not index CSS background images. | Google image SEO, https://developers.google.com/search/docs/appearance/google-images | any | static: `background-image:url()` on hero/product containers (heuristic) | `div style="background:url(p.jpg)"` → `<img src alt>` | – | warning |
| seo/img-alt | Meaningful images have contextual `alt`; no keyword stuffing. | Alt text helps Google understand images and is anchor text for image links; WCAG 1.1.1. | same; Lighthouse `image-alt` | any | static: `<img>` without `alt`; runtime Lighthouse `image-alt` | `alt="shoe shoe buy shoe"` → `alt="Red trail shoe, side view"` | – | error |
| seo/img-filename | Use short descriptive file names. | Minor signal; generic names carry nothing. | same | any | static: `IMG_\d+`, `image\d+`, hashes only in CMS uploads | `IMG_0042.jpg` → `red-trail-shoe.jpg` | – | info |
| seo/img-supported-format | Use Google-supported formats (BMP, GIF, JPEG, PNG, WebP, SVG, AVIF) with matching extensions. | Unsupported formats are not indexed. | same | any | static | – | – | info |
| seo/preferred-image | Set a preferred image via `og:image` or schema.org `primaryImageOfPage`/`image`; relevant, not a logo, not extreme ratio. | Both inform Google thumbnails (changelog 2026-03-02). | same, "specify a preferred image" | any | static | logo as og:image → page-specific image | – | info |

## Favicon and web app manifest

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/favicon-present | Home page has `<link rel="icon">` to a square image, at least 8×8 px and preferably larger than 48×48, crawlable (not robots-blocked), stable URL. | Shown next to results; one per hostname; subdirectory home pages unsupported. | Google favicon, https://developers.google.com/search/docs/appearance/favicon-in-search | any | static | none → `<link rel="icon" href="/favicon.png">` | – | warning |
| seo/favicon-format | For Google Search provide a favicon in BMP, GIF, ICO, PNG, JPEG, PPM or TIFF; an SVG-only favicon is not in Google's list (keep SVG as an additional icon). | Google's list (2026-08-28 update) does not include SVG. | same | any | static: only `type="image/svg+xml"` icon | SVG only → add PNG/ICO | – | warning |
| seo/manifest-linked | If the app is installable, link one manifest with `name`/`short_name`, `icons` (192 and 512 px), `start_url`, `display`, and no `prefer_related_applications: true`. | Chromium installability requirements. Not a ranking factor. | MDN Making PWAs installable, https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable ; MDN manifest | PWA | static: parse manifest JSON | missing 512 icon → add | – | info |

`web-features` 3.45.0 lists "Web app manifest" (`manifest`) as not Baseline.

## Social metadata (not ranking)

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| seo/og-required | Shareable pages set `og:title`, `og:type`, `og:image`, `og:url` with `<meta property=…>`, plus `og:image:alt` whenever `og:image` is set. | The four properties are the protocol's required set; scrapers use them for link previews. Not a Google ranking signal; Google may read `og:title`/`og:image` as hints for title/thumbnail. | Open Graph protocol, https://ogp.me/ "Basic metadata", "Structured properties" ; Google title link and image docs | any | static: meta with `property="og:*"` | `<meta name="og:title">` → `property="og:title"` | – | info |
| seo/og-absolute-urls | Use absolute `https://` URLs for `og:url` and `og:image`. | Every example on ogp.me is absolute; scrapers do not resolve relative paths reliably (convention, not a stated rule). | ogp.me examples | any | static: relative path in og:image | `/img/og.png` → `https://example.com/img/og.png` | – | info |
| seo/og-in-server-html | Social meta must be in server HTML. | Most preview scrapers do not run JS (general; not verified per vendor). | ogp.me (meta in head) | SPA | runtime raw HTML | client-only head tags → SSR head | – | info |

X (Twitter) cards: the developer docs URL now redirects to a generic overview, so card rules could not be confirmed
(see Not verified). Keep `twitter:card` as optional social metadata only.

## llms.txt (honest status)

- What: a proposal (Jeremy Howard, first published 2024-09-03; v2 modified 2026-08-10) for a Markdown file at `/llms.txt`
  (or a subpath) with an H1 site name (only required part), a blockquote summary, optional prose, and H2 sections of
  links; an "Optional" section marks skippable links. The site calls it a proposal open for community input, not a
  standard. https://llmstxt.org/
- Google Search: the AI optimisation guide says Google Search does not use llms.txt, AI text files, special markup or
  Markdown, and they neither help nor hurt visibility (note added 2026-06-15). The AI features page says no special
  files or markup are needed for AI Overviews/AI Mode.
  https://developers.google.com/search/docs/fundamentals/ai-optimization-guide#mythbusting ,
  https://developers.google.com/search/docs/appearance/ai-features
- Lighthouse (Chrome tooling, not Google Search) has an `llms-txt` audit inside the experimental `agentic-browsing`
  category since v13.2; it is not part of the SEO category.
- Candidate rule `seo/llms-txt-optional` (info): if present, it must be valid per llmstxt.org; never report its absence
  as an SEO error.

## Notes for skill authors

- Short skill: title/description/canonical/robots/noindex/status codes/`<a href>`/alt/hreflang reciprocity/JSON-LD
  validity. Reference file: full structured-data type list with dates, robots directives table, favicon formats,
  manifest install criteria, llms.txt status.
- Map rules to Lighthouse ids where they exist: `document-title`, `meta-description`, `http-status-code`, `link-text`,
  `crawlable-anchors`, `robots-txt`, `image-alt`, `hreflang`, `canonical`, `is-crawlable`. `structured-data` is manual.
- Noisy: duplicate-title and "generic link text" heuristics; `og:*` presence on non-shareable pages (admin, auth);
  `noindex` is correct on staging, search results, cart, account pages. Respect an allowlist of intentionally
  `noindex` routes.
- Do not claim length limits for title/description: Google states none, only truncation by width. Lighthouse checks
  presence, not length.
- Changes often (recheck each release): Google's rich result gallery and deprecations (2025–2026 removed many types),
  Lighthouse categories (agentic-browsing is new and "subject to change"), favicon formats, Google's AI guidance.
- Only a person can judge: whether a title/description is good, whether structured data matches visible content,
  whether content parity holds across mobile and desktop. Search ranking is never guaranteed by any rule here.

## Not verified

- X/Twitter Cards markup (card types, `twitter:*` fallbacks to Open Graph, image limits): developer.x.com
  `/en/docs/x-for-websites/cards/overview/markup` and `/cards/markup` returned HTTP 402 to WebFetch; curl redirected
  to `https://docs.x.com/overview`. Only third-party summaries were found, so no rule is given.
- Whether Lighthouse removed `viewport`/`font-size`/`tap-targets` from SEO in a specific version: confirmed absent in
  today's `main` config only; the release that removed them was not looked up.
- Last-updated dates of the individual Google doc pages: the fetched text did not include them; dates given come from
  the Search Central changelog.
- Book actions current documentation and eligibility: only the changelog entry was read.
