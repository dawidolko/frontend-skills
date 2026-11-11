---
name: fe-i18n
description: Makes front-end code ready for more than one language and region - lang and dir, right-to-left layout with logical properties, whole messages with ICU plurals, Intl for dates, numbers, prices and sorting, complete locale files. Use when adding a locale or translations, formatting dates or money, building a language switcher, or when asked "translate this" or "support Arabic".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Internationalisation
  area: quality
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.js **/*.vue **/*.svelte **/*.astro **/*.css **/*.scss **/locales/** **/messages/** **/i18n/**"
  rules: "a11y/html-lang a11y/lang-valid i18n/dir-rtl i18n/no-string-concat i18n/plural-rules i18n/intl-format i18n/explicit-locale i18n/same-keys i18n/logical-properties"
  version: 0.1.0
---

# Internationalisation

Read `.frontend-skills/profile.json` (its `i18n` library) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example where messages live) wins over this skill.

## Rules

- `<html lang>` follows the active locale and every `lang` is a valid tag (a11y/html-lang, a11y/lang-valid).
- Right-to-left locales set `dir="rtl"` on `<html>`; user text gets `dir="auto"` (i18n/dir-rtl).
- One message per sentence with placeholders; never join translated fragments (i18n/no-string-concat).
- Plurals use ICU `plural` or `Intl.PluralRules`, never `count === 1 ?` (i18n/plural-rules).
- Dates, numbers and prices go through `Intl` formatters, never hand-built strings (i18n/intl-format).
- Pass the app's locale to every formatter; never rely on the runtime default (i18n/explicit-locale).
- Every locale has the same keys, placeholders and the plural categories its language needs (i18n/same-keys).
- With a right-to-left locale, layout uses logical properties (i18n/logical-properties).
- Keep text out of images, let boxes grow for longer translations, and sort user-visible lists with `Intl.Collator`.
- Use the one i18n library the framework already has; never add a second.

## Do this

1. Find the i18n setup: the profile's `i18n` entry, a `locales/` or `messages/` folder, `next-intl`, `@nuxtjs/i18n`, `vue-i18n`, Paraglide, `react-intl`, `i18next`, Angular `$localize`.
2. Add every new user-visible string as a message key in the source locale, with a translator comment when the context is unclear, then the same key in every other locale.
3. Format values with the library's formatters or `Intl`, passing the active locale; keep ISO strings for machines.
4. For a new locale: add it to the routing config, `<html lang dir>`, hreflang (`fe-seo-metadata`), the language switcher (links with `hreflang` and `lang`), and check plural categories with `Intl.PluralRules`.
5. Test long and right-to-left text: a pseudo-locale that lengthens strings by about 40%, and one RTL locale.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds missing `dir` on RTL pages, concatenated messages, `=== 1` plurals, hand-built dates and prices, formatters without a locale and invalid `lang` values.
- By hand: switch to each locale and to an RTL locale; look for raw keys, clipped text, wrong number and date formats, and icons that point the wrong way.

## References

- [references/i18n.md](references/i18n.md): Intl recipes, plural categories by language, ICU message examples, RTL and logical property table, library table per framework, the language switcher. Read it when adding a locale or a translation library.
