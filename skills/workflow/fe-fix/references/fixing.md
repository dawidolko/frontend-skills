# Fixing findings reference

Depth for the `fe-fix` skill. Rule ids in brackets: `frontend-skills explain <id>`.

## Common fixes

| Rule | Usual fix | Where |
| --- | --- | --- |
| a11y/input-label | `<label for>` + `id` (or `useId()`) | The field component |
| a11y/control-name | `aria-label` or `.sr-only` text; icon `aria-hidden="true"` | The icon button component |
| a11y/img-alt | Meaningful `alt`, or `alt=""` for decoration | Where the image is used (a person confirms wording) |
| a11y/no-click-on-static | Swap `div` for `<button type="button">` | The component; reset button styles in CSS |
| a11y/focus-visible | Replace `outline: none` with a `:focus-visible` style | Global CSS or tokens |
| a11y/link-is-link | `<button>` for actions, real `href` for links | The component |
| perf/img-dimensions | `width` and `height` attributes, CSS `height: auto` | The image component |
| perf/lcp-image-not-lazy | Remove `loading="lazy"`, add `fetchpriority="high"` | The hero |
| perf/render-blocking-script | `defer` or `type="module"` | The document head |
| security/raw-html-sink | Render text, or sanitize in one helper | A shared `safeHtml()` |
| i18n/no-string-concat | One message with placeholders | Message files and the call |
| seo/meta-description | Per-page description through the metadata API | Route metadata |

## Suppression [tooling/ignore-with-reason]

| File | Comment on the line or the line above |
| --- | --- |
| HTML, Vue, Svelte, Astro, Angular templates | `<!-- fs-ignore a11y/positive-tabindex -- reason -->` |
| JSX | `{/* fs-ignore a11y/no-click-on-static -- reason */}` |
| JavaScript, TypeScript | `// fs-ignore security/no-eval -- reason` |
| CSS, SCSS, Less | `/* fs-ignore a11y/focus-visible -- reason */` |

Write the id, a space, `--` and the reason; a colon glued to the id (`a11y/x:`) is not read as an id and silences every rule on the line.

Project-wide, in `.frontend-skills/profile.json` (the person's settings, keep them):

```json
{ "audit": { "failOn": "serious", "ignore": ["seo/meta-description"], "exclude": ["legacy/**"] } }
```

Record why with `learn --lesson "We skip seo/meta-description: the app is behind a login. [seo/meta-description]" --kind convention`.

## What to tell the person

```text
Fixed: a11y/input-label (3), a11y/focus-visible (2) in components/ui/Field.tsx and styles/base.css.
Left: a11y/img-alt in src/pages/Team.tsx:14, the alt text needs the person's words.
Check by hand: Tab through the sign-up form; listen to the error message with a screen reader.
audit --changed: 0 critical, 0 serious.
```

## Sources

- Repository architecture (suppression, profile audit settings): `docs/architecture.md`
- ESLint, describing why a rule is disabled: https://eslint.org/docs/latest/use/configure/rules#comment-descriptions
