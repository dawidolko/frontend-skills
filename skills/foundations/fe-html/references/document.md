# HTML document reference

Depth for the `fe-html` skill. Rule ids in brackets are explained by `frontend-skills explain <id>`.

## The document shell

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Order history – Example Shop</title>
    <meta name="description" content="Your past orders, invoices and returns.">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/styles.css">
    <script src="/app.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header>…<nav aria-label="Main">…</nav></header>
    <main id="main">…</main>
    <footer>…</footer>
  </body>
</html>
```

- `charset` must be in the first 1024 bytes, so it goes first.
- The title names the page, most specific part first, then the site [a11y/page-title].
- `lang` uses a BCP 47 tag; mark a passage in another language with its own `lang` [a11y/html-lang].
- Scripts in the head use `defer` or `type="module"`; `async` only for scripts that depend on nothing [perf/render-blocking-script].

Where the shell lives:

| Stack | File | Notes |
| --- | --- | --- |
| Plain HTML, Vite | `index.html` | Every page file is a full document. |
| Next.js (App Router) | `app/layout.tsx` | `<html lang>` here; title and description through the `metadata` export; viewport through the `viewport` export. |
| Nuxt | `app.vue`, `nuxt.config` `app.head` | `useHead` / `useSeoMeta` per page; `htmlAttrs: { lang }`. |
| SvelteKit | `src/app.html` | `<svelte:head>` per page for the title. |
| Astro | a layout in `src/layouts/` | The layout is a full document; pages pass the title as a prop. |
| Angular | `src/index.html` | `Title` service per route (`title` in the route config). |

## Landmarks and headings

- One `<main>` per page. `<header>` and `<footer>` directly in `<body>` become banner and contentinfo landmarks.
- Two `<nav>` elements need different `aria-label`s ("Main", "Breadcrumb").
- Headings form an outline: one `h1` that names the page, then `h2` for sections, `h3` inside them. Do not skip levels to get a smaller font.
- A `<section>` without a heading is just a `div`; use `div` then.

## Choosing elements

| Need | Use | Not |
| --- | --- | --- |
| Run script | `<button type="button">` | `<a href="#">`, `<div onclick>` |
| Go somewhere | `<a href="/path">` | `<button onclick="location=…">` |
| Submit a form | `<button type="submit">` inside the form | a click handler that collects fields |
| Group of items | `<ul>`/`<ol>` with `<li>` | stacked `div`s |
| Data with rows and columns | `<table>`, `<caption>`, `<th scope="col">` | CSS grid of `div`s |
| Term and description | `<dl>`, `<dt>`, `<dd>` | bold text and `<br>` |
| Show or hide a section | `<details>` and `<summary>` | a custom toggle without state |
| Modal dialog | `<dialog>` with `showModal()` | a positioned `div` |
| Date or time | `<time datetime="2026-11-11">` | plain text only |

## Images and media

- Every `<img>` has `alt` [a11y/img-alt] and `width`/`height` [perf/img-dimensions].
- Responsive images: `srcset` with widths and `sizes`; art direction with `<picture>` and `<source media>`.
- Below-the-fold images get `loading="lazy"`; the main (LCP) image never does and may get `fetchpriority="high"`.
- Video with speech needs captions (`<track kind="captions">`); never autoplay with sound.
- Inline SVG that carries meaning: `role="img"` and a `<title>`; decorative SVG: `aria-hidden="true"`.

## Buttons and links

- A `<button>` without `type` submits its form [html/button-type].
- A link's text says where it goes out of context; "read more" needs `aria-label` or visible context.
- `target="_blank"` is the user's choice to make; when you must use it, say so in the text ("opens in a new tab").

## Style of the markup

Lowercase names, double-quoted values, closed elements (void elements such as `<img>` and `<br>` need no closing slash), two-space indentation, no inline `style` for layout, no deprecated elements (`<center>`, `<font>`). These follow the W3Schools HTML style guide: https://www.w3schools.com/html/html5_syntax.asp

## Sources

- WHATWG HTML Living Standard: https://html.spec.whatwg.org/multipage/
- MDN HTML reference: https://developer.mozilla.org/en-US/docs/Web/HTML
- WAI landmark regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- WAI headings tutorial: https://www.w3.org/WAI/tutorials/page-structure/headings/
