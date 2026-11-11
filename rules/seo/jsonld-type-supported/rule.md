---
id: seo/jsonld-type-supported
title: Structured data for rich results uses types in Google's current search gallery, not retired ones such as FAQPage or HowTo.
severity: minor
check: static
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
skill: fe-seo-metadata
since: 0.1.0
sources:
  - title: Frontend Skills research notes, SEO (Google search gallery and retired rich results, read 2026-11-11)
    url: https://github.com/dawidolko/frontend-skills/blob/main/docs/sources/seo.md
---

## Why

Google retired several rich results: HowTo is no longer shown (2023), the FAQ rich result ended in 2026, and course info, estimated salary, learning video, special announcement, vehicle listing and ClaimReview were retired in 2025. Markup for them costs build and review time and brings no search feature. It does no harm, so this is a cleanup, not an error.

## Fix

Check the current search gallery before adding structured data, and spend the effort on types that still produce features for your content (Article, Breadcrumb, Product, Organization, Event, Recipe and others). Keep a retired type only when another consumer you care about reads it.

## Examples

```json
{ "@context": "https://schema.org", "@type": "Article", "headline": "Release notes", "datePublished": "2026-11-11" }
```
