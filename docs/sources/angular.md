# Angular: sources and candidate rules

Read on 2026-11-11. Primary sources:

- npm registry, `@angular/core` (https://www.npmjs.com/package/@angular/core; data from https://registry.npmjs.org/@angular/core)
- Angular release schedule (https://angular.dev/reference/releases) and v22 event page (https://angular.dev/events/v22)
- Workspace config (https://angular.dev/reference/configs/workspace-config)
- Control flow (https://angular.dev/guide/templates/control-flow), Deferrable views (https://angular.dev/guide/templates/defer)
- Signals (https://angular.dev/guide/signals), Effects (https://angular.dev/guide/signals/effect), httpResource (https://angular.dev/guide/http/http-resource)
- Zoneless (https://angular.dev/guide/zoneless), Skipping subtrees / OnPush (https://angular.dev/best-practices/skipping-subtrees)
- SSR (https://angular.dev/guide/ssr), Hydration (https://angular.dev/guide/hydration), Incremental hydration (https://angular.dev/guide/incremental-hydration)
- Image optimization (https://angular.dev/guide/image-optimization)
- Security (https://angular.dev/best-practices/security)
- Accessibility (https://angular.dev/best-practices/a11y), Angular Aria (https://angular.dev/guide/aria/overview)
- CDK a11y (https://material.angular.dev/cdk/a11y/overview; source text read at https://github.com/angular/components/blob/main/src/cdk/a11y/a11y.md)
- AI resources: https://angular.dev/ai/develop-with-ai, https://angular.dev/ai/mcp, https://angular.dev/ai/agent-skills, https://angular.dev/llms.txt, https://angular.dev/llms-full.txt
- angular-eslint rule lists (https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/README.md, https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/README.md)

## Version and status (verified 2026-11-11)

| package | latest (npm `latest` tag) | published | licence (registry) | note |
|---|---|---|---|---|
| `@angular/core` | 22.2.5 | 2026-11-06 | MIT | `next` = 22.3.0-next.4 |
| `@angular/cli` | 22.2.6 | 2026-11-04 | MIT | ships the MCP server (`ng mcp`) |
| `@angular/cdk` | 22.2.7 | 2026-11-11 | MIT | |
| `@angular/ssr` | 22.2.6 | 2026-11-04 | MIT | |
| `angular-eslint` | 22.6.0 | 2026-10-11 | MIT | also `@angular-eslint/eslint-plugin(-template)` 22.6.0 |

- v22.0.0 published 2026-06-03 (registry `time`); the releases page lists ^22 as Active (released 2026-06-03, active to 2027-06, LTS to 2028-06), ^21 and ^20 as LTS; v2–v19 unsupported.
- Cadence changed: from v22 one major every 12 months with 4–6 minors (before v22: 6-month majors). v22.3 expected ~November 2026, v23.0 ~June 2027 (https://angular.dev/reference/releases).
- v22 stabilised Signal Forms, async signals (resource) and Angular Aria (https://angular.dev/events/v22).
- **Defaults that changed rules**: zoneless change detection is the default from v21 (https://angular.dev/guide/zoneless); `OnPush` is the default change detection strategy from v22 (https://angular.dev/best-practices/skipping-subtrees); `standalone: true` is the default from v20 (https://angular.dev/ai/develop-with-ai best-practices file). Rules that tell people to "add OnPush" or "add standalone: true" are outdated for v22 projects; version-gate them.

## Detection (for stack detection)

| signal | strength | note |
|---|---|---|
| `package.json` deps contain `@angular/core` | strong | read the major from the range to gate rules (v20 / v21 / v22) |
| `angular.json` at workspace root | strong | Angular CLI workspace config (https://angular.dev/reference/configs/workspace-config); lists projects, builders (`@angular/build:application` = esbuild builder) and `polyfills` (presence of `zone.js` there means zone-based app) |
| `@angular/ssr` dep, `src/app/app.routes.server.ts`, `src/app/app.config.server.ts`, `src/server.ts` | SSR in use | server routes with `RenderMode` live in `app.routes.server.ts` (https://angular.dev/guide/ssr) |
| `*.component.ts` with `@Component(` | strong | also `.component.html` external templates |
| `zone.js` in deps / `provideZoneChangeDetection(` in code | zone-based app | zoneless is default v21+ |
| `@angular/cdk`, `@angular/material`, `@angular/aria` deps | UI libs | |
| `nx.json` + `@angular/core` | Nx monorepo variant (`project.json` per app instead of one `angular.json`) | Not verified on nx.dev in this pass |

## Components and templates

Severity: error / warning / info in the last column.

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| angular/for-track-unique-key | Give every `@for` a `track` expression that points at a stable unique field (id/uuid), use `$index` only for static lists, and avoid tracking the item object itself. | Lets Angular do minimal DOM work; tracking by identity is noted as much slower. | https://angular.dev/guide/templates/control-flow ("Why is track in @for blocks important?") | Angular 17+ | static: `@for (` whose `track` is the loop variable alone, or `$index` on a list that is mutated | `track item` → `track item.id` | – | warning |
| angular/for-empty-block | Use an `@empty` block for the no-items state instead of a separate `@if (list.length === 0)`. | Clearer, one block. | https://angular.dev/guide/templates/control-flow (`@empty`); lint `@angular-eslint/template/prefer-at-empty` | Angular 17+ | static: lint rule | `@if (!items.length)` next to `@for` → `@empty {}` | – | info |
| angular/prefer-control-flow | Use built-in `@if`/`@for`/`@switch` instead of `*ngIf`/`*ngFor`/`*ngSwitch`. | Official guidance and lint default; built-in blocks need no imports. | https://angular.dev/ai/develop-with-ai (best-practices file, Templates); lint `@angular-eslint/template/prefer-control-flow` | Angular 17+ | static: `*ngIf`, `*ngFor` in templates | `*ngFor="let x of xs"` → `@for (x of xs; track x.id)` | – | warning |
| angular/signal-inputs-outputs | Declare inputs/outputs with `input()`, `output()` and `model()` rather than `@Input`/`@Output` decorators. | Signal-based inputs work with computed state and OnPush/zoneless. | https://angular.dev/ai/develop-with-ai (Components); https://angular.dev/guide/components/inputs; lint `@angular-eslint/prefer-signals`, `prefer-signal-model`, `prefer-output-emitter-ref` | Angular 17.1+ (stable 19+) | static: `@Input(` / `@Output(` | `@Input() name!: string` → `name = input.required<string>()` | – | info |
| angular/host-object-not-decorators | Put host bindings and listeners in the `host` object of `@Component`/`@Directive`, not `@HostBinding`/`@HostListener`. | Official best-practices file says so. | https://angular.dev/ai/develop-with-ai; lint `@angular-eslint/prefer-host-metadata-property` | Angular | static: `@HostBinding(` / `@HostListener(` | `@HostListener('click')` → `host: {'(click)': 'onClick()'}` | – | info |
| angular/no-ngclass-ngstyle | Use `[class.x]`/`[class]` and `[style.x]` bindings instead of `NgClass`/`NgStyle`. | Lighter, no directive import. | https://angular.dev/ai/develop-with-ai; lint `@angular-eslint/template/prefer-class-binding`, `prefer-style-binding` | Angular | static: `[ngClass]`, `[ngStyle]` | `[ngClass]="{a: on}"` → `[class.a]="on"` | – | info |
| angular/no-commonmodule-import | Import only the pipes/directives a standalone component uses rather than `CommonModule`. | Smaller dependency surface. | https://angular.dev/ai/develop-with-ai | Angular | static: `imports: [CommonModule` | `CommonModule` → `DatePipe` | – | info |
| angular/no-redundant-defaults | Do not write `standalone: true` (default v20+) or `changeDetection: OnPush` (default v22+) in new code. | Noise; the best-practices file tells LLMs not to. | https://angular.dev/ai/develop-with-ai; https://angular.dev/best-practices/skipping-subtrees | Angular 20+ / 22+ | static: version-gated grep | remove the property | – | info |
| angular/inject-function | Use `inject()` instead of constructor parameter injection. | Official guidance; lint rule exists. | https://angular.dev/ai/develop-with-ai (Services); lint `@angular-eslint/prefer-inject` | Angular 14+ | static: constructor params with types of services | `constructor(private http: HttpClient)` → `private http = inject(HttpClient)` | – | info |
| angular/no-template-calls | Avoid calling plain methods in template bindings (signal reads and event handlers are fine). | Methods run on every check; signals are tracked. | lint `@angular-eslint/template/no-call-expression` (rule list); signals guide https://angular.dev/guide/signals | Angular | static: lint rule (noisy: signals look like calls; configure `allowList`) | `{{ total() }}` where `total` is a method → `computed()` | – | info |
| angular/uncalled-signal | Do not use a signal in a condition without calling it. | A signal object is always truthy. | lint `@angular-eslint/no-uncalled-signals` (rule list) | Angular | static: lint rule | `@if (isOpen)` → `@if (isOpen())` | – | error |

## State and change detection

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| angular/computed-not-effect | Derive state with `computed()` (or `linkedSignal()` when it must also be settable) and never copy one signal into another inside `effect()`. | Docs call effects the last resort and warn that propagating state in effects causes ExpressionChanged errors, loops or extra change detection. | https://angular.dev/guide/signals/effect ("Use cases for effects") | Angular 16+ | static: `effect(` whose body calls `.set(`/`.update(` on another signal | `effect(() => b.set(a()*2))` → `b = computed(() => a()*2)` | – | warning |
| angular/effect-read-before-await | Read every signal an async effect depends on before the first `await`. | Reads after an await are not tracked. | https://angular.dev/guide/signals ("Reactive context and async operations") | Angular | static: `effect(async` with signal call after `await` | read `theme()` into a const first | – | warning |
| angular/no-signal-mutate | Update signals with `set()`/`update()` and new values, not in-place mutation. | Readonly signals do not guard deep mutation; consumers miss changes. | https://angular.dev/ai/develop-with-ai (State Management); https://angular.dev/guide/signals (asReadonly note) | Angular | static: `.mutate(` or `sig().push(` | `items().push(x)` → `items.update(a => [...a, x])` | – | warning |
| angular/expose-readonly-signal | Expose service state as `asReadonly()` and keep the writable signal private. | Prevents outside writes. | https://angular.dev/guide/signals ("Converting writable signals to readonly") | Angular | manual / static heuristic: public `signal(` in `@Service`/`@Injectable` | `count = signal(0)` public → private + `asReadonly()` | – | info |
| angular/zoneless-no-zone-apis | In zoneless apps (default v21+), remove `NgZone.onMicrotaskEmpty`, `onUnstable`, `onStable` and `isStable` checks, and drop `zone.js` from `polyfills` in build and test targets. | Those observables never emit without Zone; zone.js is dead weight. | https://angular.dev/guide/zoneless | Angular 20+ | static: grep the APIs; `zone.js` in `angular.json` polyfills | `polyfills: ["zone.js"]` → removed | – | warning |
| angular/no-provide-zone-cd | Flag `provideZoneChangeDetection()` in v21+ apps unless the team has chosen zone-based detection on purpose. | It overrides the zoneless default. | https://angular.dev/guide/zoneless ("Enabling Zoneless") | Angular 21+ | static | – | – | info |
| angular/onpush-compatible-state | Make state changes visible to OnPush/zoneless through signals, `AsyncPipe`, inputs or `markForCheck()`, not plain field mutation from timers/callbacks. | OnPush only refreshes on those triggers. | https://angular.dev/best-practices/skipping-subtrees ("Using OnPush"); https://angular.dev/guide/zoneless (requirements) | Angular 22 (default) | runtime: `provideCheckNoChangesConfig({exhaustive: true})` in dev (https://angular.dev/guide/zoneless) | `setTimeout(() => this.x = 1)` → `this.x.set(1)` | – | warning |
| angular/no-ngzone-removal | Keep `NgZone.run`/`runOutsideAngular` calls in libraries; they are zoneless-compatible. | Removing them can regress zone-based consumers. | https://angular.dev/guide/zoneless | Angular libs | manual | – | – | info |

## Data

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| angular/httpresource-reads-only | Use `httpResource`/`resource` for reactive reads, and plain `HttpClient` calls for POST/PUT/DELETE. | Docs advise against mutations through `httpResource` (it fires eagerly and re-fires on signal changes). | https://angular.dev/guide/http/http-resource | Angular 19.2+ (stable v22) | static: `httpResource(` with `method: 'POST'|'PUT'|'DELETE'` | – | – | warning |
| angular/transfer-cache-no-secrets | Do not add auth headers or user-specific requests to the SSR HTTP transfer cache (`includeRequestsWithAuthHeaders`, sensitive `includeHeaders`). | Cached responses are serialized into HTML and can leak between users. | https://angular.dev/guide/ssr (HttpTransferCacheOptions) | Angular SSR | static: `withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true` | – | – | error |
| angular/lazy-routes | Lazy-load feature routes with `loadComponent`/`loadChildren`. | Smaller initial bundle. | https://angular.dev/ai/develop-with-ai ("Implement lazy loading for feature routes") | Angular | static: routes importing components eagerly in large apps (heuristic) | `component: Admin` → `loadComponent: () => import(...)` | – | info |

## Rendering modes (SSR, hydration, @defer)

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| angular/ssr-no-browser-globals | Do not touch `window`, `document`, `navigator`, `location` in code that runs on the server; use `inject(DOCUMENT)` or `afterNextRender`/`afterEveryRender` for browser-only work. | Those globals do not exist on the server. | https://angular.dev/guide/ssr ("Authoring server-compatible components", "Accessing Document via DI") | Angular SSR/prerender | static: bare `window.`/`document.` in component/service files when `@angular/ssr` present | `document.title` → `inject(DOCUMENT)` | – | error |
| angular/no-platform-branch-in-template | Do not render different markup on server vs client with `isPlatformBrowser` inside `@if`. | Causes hydration mismatch and layout shift. | https://angular.dev/guide/ssr (IMPORTANT note) | Angular SSR | static: `isPlatformBrowser` used to drive template conditions | use `@defer` or `afterNextRender` | – | warning |
| angular/hydration-no-direct-dom | Avoid direct DOM manipulation (innerHTML, appendChild, moving nodes) in hydrated components; `ngSkipHydration` is a temporary workaround only on component hosts. | Server and client DOM must match. | https://angular.dev/guide/hydration ("Constraints", "How to skip hydration") | Angular SSR | static: `nativeElement.appendChild`, `.innerHTML =`, `ngSkipHydration` count | – | – | warning |
| angular/hydration-valid-html | Write valid HTML in templates and always include `<tbody>` in tables. | Browsers auto-insert `<tbody>`, causing hydration mismatch. | https://angular.dev/guide/hydration ("Valid HTML structure") | Angular SSR | static: `<table>` containing `<tr>` without `<tbody>` | – | – | error |
| angular/server-render-mode-explicit | Declare a `RenderMode` (Prerender / Server / Client) per route in `app.routes.server.ts`, and do not prerender pages whose content varies per user. | Default prerenders everything. | https://angular.dev/guide/ssr ("Server routing", "Prerendering") | Angular 19+ SSR | static: presence of file; manual review | – | – | info |
| angular/defer-not-above-fold | Do not `@defer` content that is visible on first load; if unavoidable, avoid `immediate`/`timer`/`viewport`/`when` triggers that fire during initial render, or use incremental hydration triggers. | Raises CLS. | https://angular.dev/guide/templates/defer ("Avoid layout shifts") | Angular 17+ | manual / runtime: Lighthouse `cumulative-layout-shift` | – | – | warning |
| angular/defer-nested-different-triggers | Give nested `@defer` blocks different triggers. | Same triggers load at once and cascade requests. | https://angular.dev/guide/templates/defer ("Avoid cascading loads") | Angular 17+ | static: nested `@defer` with same trigger | – | – | info |
| angular/defer-standalone-deps | Only standalone components/directives/pipes inside `@defer` are actually deferred. | NgModule-based deps stay in the eager bundle. | https://angular.dev/guide/templates/defer | Angular 17+ | static (needs symbol resolution) | – | – | info |
| angular/defer-ssr-placeholder | Expect `@defer` to render only its `@placeholder` on the server unless `hydrate` triggers are used; put SEO-critical text outside or use incremental hydration. | Main content is otherwise missing from SSR HTML. | https://angular.dev/guide/templates/defer ("How does @defer work with SSR and SSG?"); https://angular.dev/guide/incremental-hydration | Angular SSR | manual | `@defer (on viewport)` → `@defer (on viewport; hydrate on viewport)` | – | info |
| angular/incremental-hydration-default | Know that `provideClientHydration()` enables incremental hydration and event replay by default (opt out with `withNoIncrementalHydration()`); drop a redundant `withEventReplay()`. | Avoids stale config. | https://angular.dev/guide/incremental-hydration | Angular 20+ (Not verified: exact version the default changed) | static: `withEventReplay()` together with default hydration | – | – | info |

## Accessibility

Helps you work to WCAG 2.2 AA; lint and the dev-mode checks find only part of the problems, keyboard and screen-reader testing by a person is still needed.

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| angular/a11y-native-host | Build button/link-like components on native `<button>`/`<a>` via attribute selectors (e.g. `button[appBtn]`) instead of a custom element wrapper. | Keeps native keyboard and role behaviour. | https://angular.dev/best-practices/a11y ("Augmenting native elements") | Angular | static: component selector like `app-button` whose template is a clickable `div` | `<app-button>` → `<button appButton>` | – | warning |
| angular/a11y-wrap-native-input | Wrap native `<input>` with content projection rather than hiding it inside a component template. | Consumers can then set attributes like `aria-describedby`. | https://angular.dev/best-practices/a11y ("Using containers for native elements") | Angular | manual | – | – | info |
| angular/a11y-route-focus | After router navigation, move focus to the main heading/content (listen for `NavigationEnd`), never leave it on `<body>`. | Keyboard and screen-reader users lose their place. | https://angular.dev/best-practices/a11y ("Focus management after navigation") | Angular Router | static heuristic: app uses Router but no `NavigationEnd` focus handling; runtime: manual | – | – | warning |
| angular/a11y-aria-current | Set `ariaCurrentWhenActive="page"` on `routerLinkActive` links. | The active class is only visual. | https://angular.dev/best-practices/a11y ("Active links identification") | Angular Router | static: `routerLinkActive` without `ariaCurrentWhenActive` | – | – | warning |
| angular/a11y-defer-live-region | Wrap `@defer` content that appears after load in an `aria-live="polite"` container when users need to know it arrived. | Screen readers may not announce the change. | https://angular.dev/best-practices/a11y ("Deferred Loading"); https://angular.dev/guide/templates/defer ("Keep accessibility in mind") | Angular 17+ | manual | – | – | info |
| angular/a11y-aria-binding | Bind ARIA as attributes (`[attr.aria-x]` or `[aria-x]`), and use element-reference properties such as `[ariaLabelledByElements]` for element lists. | Keeps values in sync. | https://angular.dev/best-practices/a11y ("ARIA attributes and properties") | Angular | static | – | – | info |
| angular/a11y-use-cdk-aria | For dialogs, menus, tabs, comboboxes etc. use `@angular/aria` headless directives or CDK `cdkTrapFocus`, `LiveAnnouncer`, `FocusMonitor`, `ListKeyManager`, instead of hand-rolled keyboard handling. | Tested keyboard/ARIA patterns. | https://angular.dev/best-practices/a11y ("Angular UI components"); https://angular.dev/guide/aria/overview; https://material.angular.dev/cdk/a11y/overview | Angular | manual | – | `@angular/cdk@22.2.7`, MIT (npm) – first-party; size Not verified | info |
| angular/a11y-cdk-visually-hidden | Hide text visually but keep it for screen readers with `.cdk-visually-hidden` (or the `a11y-visually-hidden` mixin), and style forced-colors mode with the `high-contrast` mixin. | Avoids `display:none` hiding from AT. | https://material.angular.dev/cdk/a11y/overview ("Styling utilities") | Angular + CDK | static: `display:none` on labels (heuristic) | – | – | info |
| angular/a11y-eslint-template | Enable the angular-eslint template accessibility rules (`alt-text`, `elements-content`, `label-has-associated-control`, `click-events-have-key-events`, `interactive-supports-focus`, `mouse-events-have-key-events`, `no-autofocus`, `no-distracting-elements`, `no-positive-tabindex`, `role-has-required-aria`, `table-scope`, `valid-aria`, `button-has-type`). | Catches common template mistakes statically. | https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/README.md (accessibility preset); a11y guide links Angular ESLint | Angular | static: ESLint `angular.configs.templateAccessibility` (preset name Not verified) | – | `angular-eslint@22.6.0`, MIT (npm) | warning |

## Performance

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| angular/ngoptimizedimage | Use `NgOptimizedImage` (`ngSrc`) with `width`/`height` (or `fill`) for static images, and `sizes` for responsive ones. | Enforces dimensions (CLS), lazy-loads, warns on distortion. | https://angular.dev/guide/image-optimization; lint `@angular-eslint/template/prefer-ngsrc` | Angular | static: `<img src=` in templates (not base64) | `<img src="a.jpg">` → `<img ngSrc="a.jpg" width=... height=...>` | – | warning |
| angular/lcp-image-priority | Mark the LCP image with `priority`. | Sets `fetchpriority=high`, disables lazy load; Angular warns in dev if missing. | https://angular.dev/guide/image-optimization ("Mark images as priority") | Angular | runtime: dev console warning; Lighthouse `lcp-lazy-loaded`/`prioritize-lcp-image` | – | – | warning |
| angular/no-impure-pipes | Avoid impure pipes. | They run on every change detection. | lint `@angular-eslint/no-pipe-impure` (rule list) | Angular | static | – | – | info |

## Security

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| angular/no-bypass-security-trust | Treat any `bypassSecurityTrustHtml/Script/Style/Url/ResourceUrl` call as a security review item; only pass values you produced or sanitized yourself, never user input. | Bypassing disables Angular's sanitizer and opens XSS. | https://angular.dev/best-practices/security ("Trusting safe values"; "Avoid Angular APIs marked Security Risk") | Angular | static: grep `bypassSecurityTrust` | `bypassSecurityTrustHtml(userHtml)` → `[innerHTML]="userHtml"` (sanitized) | – | error |
| angular/no-native-dom-sinks | Do not write to `ElementRef.nativeElement.innerHTML`/`outerHTML`/`document.write`; use template bindings, or `DomSanitizer.sanitize` when unavoidable. | Native DOM APIs are not sanitized. | https://angular.dev/best-practices/security ("Direct use of the DOM APIs") | Angular | static: `nativeElement.innerHTML =`, `insertAdjacentHTML` | – | – | error |
| angular/no-dynamic-templates | Never build templates from user input at runtime; ship AOT-compiled templates only. | Templates are executable code. | https://angular.dev/best-practices/security ("Angular's cross-site scripting security model", AOT) | Angular | static: JIT compiler imports, string-built `template:` | – | – | error |
| angular/csp-and-trusted-types | Send a CSP (nonce via `ngCspNonce` or `CSP_NONCE`, or `security.autoCsp` for static hosting) and enforce Trusted Types with the Angular policies. | Defense in depth against XSS; never hard-code a static nonce. | https://angular.dev/best-practices/security ("Content security policy", "Enforcing Trusted Types") | Angular | static: `angular.json` `security.autoCsp`; runtime: response headers | `ngCspNonce="abc123"` hard-coded → per-response nonce | – | warning |
| angular/xsrf-client-half | Remember HttpClient only does the client half of XSRF; the server must set and verify the `XSRF-TOKEN` cookie/header. | Otherwise no protection. | https://angular.dev/best-practices/security ("HttpClient XSRF/CSRF security") | Angular | manual | – | – | info |
| angular/keep-updated | Stay on a supported Angular major and do not fork Angular. | Security fixes only land on supported versions. | https://angular.dev/best-practices/security ("Best practices"); https://angular.dev/reference/releases | Angular | static: major < 20 is unsupported as of 2026-11-11 (v20 LTS ends 2026-11-28) | – | – | warning |

## Official tooling

- **angular-eslint** (`angular-eslint` 22.6.0, MIT). TS rules include `prefer-signals`, `prefer-inject`, `prefer-standalone`, `prefer-on-push-component-change-detection`, `prefer-host-metadata-property`, `prefer-service-decorator`, `no-uncalled-signals`, `computed-must-return`, `reactive-context-must-read-signal`, `no-pipe-impure`, `no-implicit-take-until-destroyed`, `no-developer-preview`, `no-experimental`. Template rules include `prefer-control-flow`, `prefer-at-empty`, `prefer-at-else`, `use-track-by-function`, `prefer-ngsrc`, `no-call-expression`, `prefer-class-binding`, `prefer-style-binding`, `no-inline-styles`, `banana-in-box`, `no-negated-async`, `eqeqeq`, plus the accessibility set listed above (https://github.com/angular-eslint/angular-eslint, READMEs of `packages/eslint-plugin` and `packages/eslint-plugin-template`).
- Dev-mode runtime checks: hydration mismatch errors (NG05xx), LCP-without-priority warning, `provideCheckNoChangesConfig` for zoneless (https://angular.dev/guide/hydration, https://angular.dev/guide/image-optimization, https://angular.dev/guide/zoneless).

## AI-agent resources (exist, verified 2026-11-11)

- llms.txt: https://angular.dev/llms.txt (index) and https://angular.dev/llms-full.txt (~100 KB compiled guide).
- Best-practices system prompt / rules files (GEMINI.md, copilot-instructions.md, cursor rules, AGENTS.md, .instructions.md, Windsurf guidelines): https://angular.dev/ai/develop-with-ai.
- MCP server in the CLI: `npx -y @angular/cli mcp` (tools include `get_best_practices`, `search_documentation`, `list_projects`, `onpush_zoneless_migration`, `run_target`, `devserver_*`, `ai_tutor`): https://angular.dev/ai/mcp. The develop-with-ai page still calls it experimental.
- Official Agent Skills `angular-developer`, `angular-new-app`: https://angular.dev/ai/agent-skills (repo https://github.com/angular/skills).
- WebMCP guide exists at https://angular.dev/ai/webmcp (not read in depth).

## Notes for skill authors

- Short skill: version gate (read `@angular/core` major), the 10 rules most often broken (`track`, control flow, signals/computed over effect, no bypassSecurityTrust, SSR globals, tbody, NgOptimizedImage+priority, route focus, aria-current, defer above fold). Reference file: the rest plus lint rule names.
- Defaults flipped in v20/21/22 (standalone, zoneless, OnPush); never emit "add OnPush" for v22 projects. Recheck every major (now yearly, next ~June 2027).
- `no-call-expression` is noisy in signal-heavy code; keep it info or off.
- `@Service` decorator (v22+) is recommended in the best-practices file; not yet mature enough to be a rule above info.
- A11y: lint covers templates only; focus after navigation, live regions and keyboard flows need a person.

## Not verified

- Exact angular-eslint preset names for accessibility (`templateAccessibility`) — only the README marker ":accessibility:" was read.
- min+gzip sizes for `@angular/cdk`/`@angular/aria` (not checked on bundlephobia).
- The Angular version in which incremental hydration became default inside `provideClientHydration()`; only the current guide text was read.
- Nx detection details (`nx.json`/`project.json`) — not read on nx.dev.
- Angular v22 release blog post itself (blog.angular.dev) was not opened; release date taken from npm registry time and the releases page.
