---
id: seo/meta-description
title: Each indexable page has its own meta description that summarises that page.
severity: moderate
check: static
applies:
  - html
lighthouse:
  - meta-description
skill: fe-seo-metadata
since: 0.1.0
sources:
  - title: Chrome for Developers, Document does not have a meta description (Lighthouse audit)
    url: https://developer.chrome.com/docs/lighthouse/seo/meta-description
  - title: MDN, the meta element (name="description")
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name
---

## Why

Search engines often use the description as the snippet under the title. Without one they pick text from the page, often a menu or a cookie notice, and the result attracts fewer clicks. Shared descriptions across pages are nearly as bad as none.

## Fix

Write one or two sentences per page that say what is on it, in the page's language. Google states no length limit; long text is cut by width, so put the important part first. In frameworks use the metadata API (Next.js `metadata.description`, Nuxt `useSeoMeta({ description })`, Astro and SvelteKit layout props, Angular `Meta`).

## Examples

```html
<!-- good -->
<meta name="description" content="Plans for teams of every size, with a free tier and monthly or yearly billing.">
```
