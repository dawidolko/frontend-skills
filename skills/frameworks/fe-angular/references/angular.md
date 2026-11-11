# Angular reference

Depth for the `fe-angular` skill, for Angular 22 (latest stable checked 2026-11-11 on the npm registry: `@angular/core` 22.2.5; v22.0.0 was published 2026-06-03). Rule ids in brackets: `frontend-skills explain <id>`.

## Defaults by version

From v22 Angular ships one major a year with several minors (before v22: every six months). Read the major before writing code.

| Since | Default | So in new code |
| --- | --- | --- |
| v17 | Built-in control flow (`@if`, `@for`, `@switch`, `@defer`) | Use the blocks [angular/control-flow] |
| v19 | Signal inputs and queries stable; `linkedSignal` and `resource` introduced | Prefer signal APIs |
| v20 | Standalone components; `NgIf`, `NgFor`, `NgSwitch` deprecated | No `standalone: true`, no `CommonModule` imports |
| v21 | Zoneless change detection | No `zone.js` in `polyfills`; no `NgZone.onStable` and similar |
| v22 | `OnPush` change detection; Signal Forms, `resource` and Angular Aria stable | No explicit `OnPush`; state changes through signals |

Supported majors on 2026-11-11: 22 (active), 21 and 20 (LTS; 20 ends 2026-11-28). Migrate with `ng update` and the schematics, such as `ng generate @angular/core:control-flow`.

## Components and templates

| Instead of | Use |
| --- | --- |
| `@Input() name!: string` | `name = input.required<string>()` |
| `@Output() saved = new EventEmitter()` | `saved = output<Order>()` |
| `@Input()` + `@Output() valueChange` | `value = model<string>()` with `[(value)]` [angular/banana-in-box] |
| `constructor(private http: HttpClient)` | `private http = inject(HttpClient)` |
| `@HostBinding`, `@HostListener` | `host: { '[class.active]': 'active()', '(keydown)': 'onKey($event)' }` |
| `[ngClass]`, `[ngStyle]` | `[class.selected]="selected()"`, `[style.width.px]="width()"` |
| `*ngFor="let x of xs; trackBy: byId"` | `@for (x of xs(); track x.id) { … } @empty { … }` [angular/for-track-id] |
| A method called in a binding | A `computed()` read in the binding |
| `<app-button>` with a clickable `div` inside | `button[appButton]` selector on a native button |

## Signals and data

| Need | API |
| --- | --- |
| Local state | `signal()`; change with `set()` or `update(v => …)`, never in-place mutation |
| Derived value | `computed()` [angular/computed-not-effect] |
| Derived but resettable by the user | `linkedSignal()` |
| Side effect outside Angular (storage, canvas, logging) | `effect()`; read every signal before the first `await` |
| Reactive read from an API | `httpResource(() => `/api/users/${id()}`)` or `resource()` with `value()`, `isLoading()`, `error()` |
| Create, update, delete | `HttpClient` methods in an event handler; not `httpResource` |
| Service state | private `signal`, public `asReadonly()` |
| Browser-only work after render | `afterNextRender()`, `afterEveryRender()` |
| Template condition on a signal | Call it: `@if (open())`; an uncalled signal is always truthy |

## @defer

- Triggers: `on idle` (default), `on viewport`, `on interaction`, `on hover`, `on immediate`, `on timer(2s)`, `when cond`; `prefetch on …` loads earlier than it renders.
- Only standalone components, directives and pipes inside the block are split into a separate chunk.
- Give `@placeholder` the final size; content visible on first load must not be deferred, or the layout shifts.
- Nested blocks get different triggers, or they load at once.
- On the server only `@placeholder` renders unless incremental hydration triggers are set (`hydrate on viewport`); keep text that search engines need outside.
- Wrap content that appears later in an `aria-live="polite"` region when users must know it arrived.

## SSR and hydration

| Topic | Do this |
| --- | --- |
| Browser globals | `inject(DOCUMENT)`; browser-only code in `afterNextRender()` [angular/ssr-browser-globals] |
| Different markup per platform | Never branch the template on `isPlatformBrowser`; it breaks hydration |
| Tables | Explicit `<tbody>` [angular/table-tbody] |
| Direct DOM changes | Refactor; `ngSkipHydration` on the host only as a temporary workaround |
| Render modes | `RenderMode.Prerender`, `Server` or `Client` per route in `app.routes.server.ts` |
| Transfer cache | No `includeRequestsWithAuthHeaders: true`; never cache per-user responses into the HTML |
| Hydration setup | `provideClientHydration()`; incremental hydration and event replay are part of it in current versions |

## Images

`NgOptimizedImage` [angular/ng-optimized-image]: `ngSrc` plus `width` and `height` (intrinsic size) or `fill` in a positioned parent; `priority` on the LCP image (sets `fetchpriority="high"`, eager loading and a preload on the server); `sizes` for responsive images; a loader (`provideImgixLoader` and others) builds `srcset`. Not supported: inline base64 images, CSS backgrounds (use an `<img fill>` child) and `<picture>`.

## Accessibility

Helps you work to WCAG 2.2 AA as a target; lint finds only part of the problems, so test with a keyboard and a screen reader.

- Active links: `routerLinkActive` + `ariaCurrentWhenActive="page"` [angular/router-aria-current].
- After navigation, focus the main heading (`tabindex="-1"`) on `NavigationEnd`; never leave focus on `body`.
- ARIA bindings: `[attr.aria-expanded]="open()"` or `[aria-expanded]`; element lists with `[ariaLabelledByElements]`.
- Widgets: `@angular/aria` directives or CDK `cdkTrapFocus`, `LiveAnnouncer`, `FocusMonitor`, `ListKeyManager`; `.cdk-visually-hidden` for screen-reader-only text.
- Native inputs: project them with `<ng-content>` so consumers can set `aria-describedby`.

## Security

- Angular escapes interpolation and sanitizes `[innerHTML]`, `[href]`, `[src]`, `[style]`. `bypassSecurityTrust*` turns that off [angular/no-bypass-security-trust].
- Never write to `nativeElement.innerHTML`; never build templates from strings at run time (AOT only).
- Content Security Policy with a per-response nonce (`ngCspNonce` or the `CSP_NONCE` token) or `security.autoCsp` for static hosting; Trusted Types with Angular's policies.
- `HttpClient` sends the XSRF header; the server must set and verify the token.

## angular-eslint rules worth enabling

TypeScript: `prefer-signals`, `prefer-inject`, `no-uncalled-signals`, `computed-must-return`, `no-pipe-impure`. Templates: `prefer-control-flow`, `prefer-at-empty`, `prefer-ngsrc`, `banana-in-box`, `eqeqeq`, `prefer-class-binding`, and the accessibility set (`alt-text`, `elements-content`, `label-has-associated-control`, `click-events-have-key-events`, `interactive-supports-focus`, `no-positive-tabindex`, `role-has-required-aria`, `valid-aria`, `button-has-type`).

## Sources

- npm registry, @angular/core: https://registry.npmjs.org/@angular/core
- Angular releases: https://angular.dev/reference/releases
- Control flow: https://angular.dev/guide/templates/control-flow
- NgIf (deprecated): https://angular.dev/api/common/NgIf
- Deferrable views: https://angular.dev/guide/templates/defer
- Signals: https://angular.dev/guide/signals
- Effects: https://angular.dev/guide/signals/effect
- Zoneless: https://angular.dev/guide/zoneless
- Skipping subtrees (OnPush): https://angular.dev/best-practices/skipping-subtrees
- Server-side and hybrid rendering: https://angular.dev/guide/ssr
- Hydration: https://angular.dev/guide/hydration
- Image optimization: https://angular.dev/guide/image-optimization
- Accessibility: https://angular.dev/best-practices/a11y
- Security: https://angular.dev/best-practices/security
- Develop with AI (best practices): https://angular.dev/ai/develop-with-ai
- angular-eslint template rules: https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/README.md
