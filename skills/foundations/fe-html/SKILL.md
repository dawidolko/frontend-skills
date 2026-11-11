---
name: fe-html
description: Writes and reviews HTML documents and templates (plain HTML, JSX, Vue, Svelte, Astro, Angular) with valid structure, semantic elements, landmarks, headings, images and buttons that work for everyone. Use when creating or editing markup, a page layout or a document head, or when asked "is this HTML correct", "make this semantic", "fix the markup".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: HTML documents and semantics
  area: foundations
  lane: A
  requires: web
  globs: "**/*.html **/*.htm **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro"
  rules: "html/doctype html/button-type a11y/html-lang a11y/page-title a11y/img-alt perf/render-blocking-script"
  version: 0.1.0
---

# HTML documents and semantics

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Start every full document with `<!doctype html>` and `<html lang="…">` (html/doctype, a11y/html-lang).
- Put `<meta charset="utf-8">` first in `<head>`, then the viewport meta tag, then a specific `<title>` (a11y/page-title).
- Give every `<img>` an `alt`: the meaning in context, or `alt=""` when it only decorates (a11y/img-alt).
- Use the element that already does the job: `<button type="button">` for actions, `<a href>` for navigation, `<nav>`, `<main>`, `<header>`, `<footer>` for regions (html/button-type).
- One `<main>` per page; headings go in order (`h1` then `h2`, never skipping a level for size; size is CSS).
- Load head scripts with `defer` or `type="module"` (perf/render-blocking-script).
- Never put a click handler on a `div` or `span`, never use `<br>` for spacing or tables for layout, never invent ARIA where a native element exists.
- Lowercase element and attribute names, quoted attribute values, closed non-void elements.

## Do this

1. Find the document shell first (`index.html`, the root layout, `app.html`, a layout component); fix the head there once instead of per page.
2. Outline the page as landmarks and headings before styling: `header` > `nav`, `main` > `h1` and sections with headings, `footer`.
3. Pick elements by meaning: lists for groups of like items, `<table>` with `<th scope>` for data, `<figure>`/`<figcaption>` for captioned media, `<time datetime>` for dates, `<dl>` for term and value pairs.
4. For each image decide: informative (describe it), decorative (`alt=""`), functional inside a link or button (describe the action). Add `width` and `height`.
5. In a framework template keep the same semantics; components should render a real `<button>` or `<a>`, not wrap a `div`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` lists the static findings with file and line; `explain <rule id>` gives the reason and the fix.
- By hand: Tab through the page (every control reachable, in order), view the heading outline, and run the W3C validator (https://validator.w3.org/nu/) on a rendered page when markup looks unusual.

## References

- [references/document.md](references/document.md): the document shell, head order, landmarks, headings, lists, tables and media, with framework notes. Read it when you build a page or layout from scratch.
