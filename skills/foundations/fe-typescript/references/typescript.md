# TypeScript reference

Depth for the `fe-typescript` skill. Latest stable checked 2026-11-11 on the npm registry: `typescript` 7.0.2 (released 2026-07-08, the native compiler); `@typescript/typescript6` 6.0.2 for tools that need the API. Rule ids in brackets: `frontend-skills explain <id>`.

## TypeScript 6 and 7: what changed

| Change | Since | What to do |
| --- | --- | --- |
| `strict` defaults to `true` | 6.0 | Remove `"strict": false`; on 5.x write `"strict": true` [ts/strict] |
| `types` defaults to `[]` | 6.0 | List globals: `"types": ["vite/client"]`, `["node"]`, test runner types |
| `module` defaults to `esnext`, `target` to the latest stable edition | 6.0 | Set them anyway in app configs, so the intent is visible |
| `noUncheckedSideEffectImports` defaults to `true` | 6.0 | A typo in `import './styles.css'` now errors; keep it |
| `rootDir` defaults to the config folder | 6.0 | Set it when sources live elsewhere |
| Deprecated: `target: es5`, `downlevelIteration`, `moduleResolution: node`/`node10`, `module: amd`/`umd`/`system`/`none`, `baseUrl`, `esModuleInterop: false`, `allowSyntheticDefaultImports: false`, `alwaysStrict: false`; removed: `moduleResolution: classic`, `outFile` | 6.0 deprecates, 7.0 errors | Replace before upgrading [ts/no-deprecated-options] |
| Native compiler, 8 to 12 times faster builds, no programmatic API | 7.0 | Alias 6.0 for typescript-eslint and the Vue, Svelte, Astro and MDX tools; Angular uses 7 for CLI checks and 6.0 in the editor |

Silencing 6.0 deprecations with `"ignoreDeprecations": "6.0"` only buys time: 7.0 refuses them.

## A tsconfig for a bundled browser app

```jsonc
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2024", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "types": ["vite/client"],
    "paths": { "@/*": ["./src/*"] },
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Frameworks ship a base to extend: `@vue/tsconfig`, `astro/tsconfigs/strict` (or `strictest`), `./.svelte-kit/tsconfig.json`, Next.js writes its own on first run, Angular CLI generates one with `strict` and `strictTemplates`. Extend the base and override only what you must.

## The strict family [ts/strict]

| Flag | Catches |
| --- | --- |
| `strictNullChecks` | Reading from a value that may be `null` or `undefined` |
| `noImplicitAny` | Parameters and variables whose type silently became `any` |
| `strictFunctionTypes` | Callbacks with parameter types that do not fit |
| `strictBindCallApply` | Wrong arguments to `bind`, `call`, `apply` |
| `strictPropertyInitialization` | Class fields (web components, Angular) never assigned |
| `useUnknownInCatchVariables` | `catch (err)` used without a check |
| `noImplicitThis`, `alwaysStrict`, `strictBuiltinIteratorReturn` | Loose `this`, sloppy mode, iterator results typed as `any` |
| Not in `strict`: `noUncheckedIndexedAccess` | `list[i]` and `record[key]` that may be missing |
| Not in `strict`: `exactOptionalPropertyTypes` | `undefined` passed where a property may only be absent |

## Data at the boundaries [ts/validate-untrusted]

Untrusted: `fetch` and WebSocket bodies, `JSON.parse`, `localStorage`/`sessionStorage`, `postMessage`, URL and search params, `FormData`, cookies, third-party script globals.

```ts
import * as v from 'valibot'

const User = v.object({ id: v.string(), name: v.string(), role: v.picklist(['admin', 'member']) })
export type User = v.InferOutput<typeof User>

export async function loadUser(id: string, signal?: AbortSignal): Promise<User> {
  const res = await fetch(`/api/users/${id}`, { signal })
  if (!res.ok) throw new Error(`GET /api/users/${id} failed: ${res.status}`)
  return v.parse(User, await res.json())
}
```

| Validator (npm, 2026-11-11) | Licence | Note |
| --- | --- | --- |
| `valibot` 1.5.0 | MIT | One function per check, tree-shakes to a few hundred bytes per schema; a good default for browser code |
| `zod` 4.6.7 (`zod/mini`) | MIT | Use the `zod/mini` entry in the browser; the classic API is much larger |
| `superstruct` 2.0.2 | MIT | Small, fewer features |
| `@sinclair/typebox` 0.34.52 | MIT | When the API already speaks JSON Schema |

Without a library, a type guard: `function isUser(x: unknown): x is User { return typeof x === 'object' && x !== null && typeof (x as { id?: unknown }).id === 'string' }`, and keep it next to the type.

## Narrowing instead of casting

| Instead of | Write |
| --- | --- |
| `el!.focus()` | `el?.focus()`, or `if (!el) return` |
| `(err as Error).message` | `err instanceof Error ? err.message : String(err)` |
| `event.target as HTMLInputElement` | `event.currentTarget` typed by the handler, or `if (event.target instanceof HTMLInputElement)` |
| `data as Product[]` | validate once at the boundary |
| `const config = {...} as Config` | `const config = {...} satisfies Config` |
| `enum Status {...}` | `const Status = { Idle: 'idle', Done: 'done' } as const; type Status = (typeof Status)[keyof typeof Status]` |

Exhaustive `switch` over a union:

```ts
type State = { status: 'loading' } | { status: 'error'; error: Error } | { status: 'done'; items: Item[] }
function label(s: State) {
  switch (s.status) {
    case 'loading': return 'Loading…'
    case 'error': return s.error.message
    case 'done': return `${s.items.length} items`
    default: { const never: never = s; return never }
  }
}
```

## Typing per framework

| Framework | Props and events |
| --- | --- |
| React | `function Button(props: ComponentProps<'button'> & { tone?: 'primary' })`; `ref` is a prop in React 19 |
| Vue | `defineProps<{ title: string }>()`, `defineEmits<{ close: [] }>()`, `defineModel<string>()`; check with `vue-tsc` |
| Svelte | `let { title }: { title: string } = $props()`; check with `svelte-check` |
| Angular | `title = input.required<string>()`, `closed = output<void>()`; `strictTemplates` in `angularCompilerOptions` |
| Astro | `interface Props { title: string }` in the front matter; `astro check` |
| Lit | `@property({ type: String }) title = ''` with `noImplicitOverride` for lifecycle methods |

## Silencing errors [ts/no-ts-ignore]

`// @ts-expect-error <reason>` fails once the error is gone; `@ts-ignore` and `@ts-nocheck` hide future errors too. Track each one like a TODO.

## Sources

- TSConfig reference: https://www.typescriptlang.org/tsconfig/
- Announcing TypeScript 6.0: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
- Announcing TypeScript 7.0: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- TypeScript handbook, Narrowing: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- TypeScript handbook, unknown: https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown
- TypeScript 4.9, satisfies: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
- Vite, TypeScript: https://vite.dev/guide/features#typescript
- typescript-eslint, typed linting: https://typescript-eslint.io/getting-started/typed-linting/
- Valibot: https://valibot.dev/guides/introduction/
- Zod Mini: https://zod.dev/packages/mini
