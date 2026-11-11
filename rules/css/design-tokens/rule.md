---
id: css/design-tokens
title: Colours and spacing come from the project's tokens (custom properties or variables); a literal that has a token, or repeats, is a finding.
severity: minor
check: static
applies:
  - project
skill: fe-css-architecture
since: 0.1.0
sources:
  - title: MDN, Using CSS custom properties (variables)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
  - title: Sass documentation, Variables
    url: https://sass-lang.com/documentation/variables/
---

## Why

A brand colour typed as `#0a58ca` in forty rules cannot be changed, themed or put into dark mode in one place, and a near-miss (`#0a58cb`) slips in unnoticed. When the project already has a token for the value, the literal also hides the link between the design and the code.

## Fix

Use the token the project defines: `var(--color-brand)`, `$color-brand` or `@color-brand`. When a colour repeats and no token exists yet, add one on `:root` (or in the Sass tokens file) with a name that says its role, not its hue, and replace the literals. Spacing that equals a step of the spacing scale uses that step.

## Examples

```css
/* bad: the project defines --color-brand: #0a58ca and --space-4: 1rem */
.card { padding: 1rem; border: 1px solid #0a58ca; }
/* good */
.card { padding: var(--space-4); border: 1px solid var(--color-brand); }
```
