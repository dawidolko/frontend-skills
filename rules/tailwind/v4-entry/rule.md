---
id: tailwind/v4-entry
title: In Tailwind CSS 4, load Tailwind with @import "tailwindcss" and a legacy JS config with @config; @tailwind directives do nothing.
severity: moderate
check: static
applies:
  - project
stack:
  - tailwind
skill: fe-tailwind
since: 0.1.0
sources:
  - title: Tailwind CSS docs, Upgrade guide (removed @tailwind directives, using a JavaScript config file)
    url: https://tailwindcss.com/docs/upgrade-guide
  - title: Tailwind CSS docs, Functions and directives (@import, @config)
    url: https://tailwindcss.com/docs/functions-and-directives
---

## Why

Tailwind 4 removed the `@tailwind base; @tailwind components; @tailwind utilities;` directives and no longer finds `tailwind.config.js` on its own. A project upgraded by changing the version number builds without errors but ships without utilities, or without the colours, fonts and plugins its JS config defined.

## Fix

Run `npx @tailwindcss/upgrade` (Node.js 20 or newer) on a clean branch. By hand: replace the three directives with `@import "tailwindcss";`, move the theme into `@theme { ... }` in that CSS file, or keep the JS config for now with `@config "../tailwind.config.js";` right after the import.

## Examples

```css
/* bad (tailwindcss 4 in package.json) */
@tailwind base;
@tailwind components;
@tailwind utilities;
/* good */
@import "tailwindcss";
@theme { --color-brand-600: #0a7a3e; }
```
