/*
 * angular/control-flow: reports elements in Angular templates that use the structural directives *ngIf, *ngFor
 * or the NgSwitch directives (*ngSwitchCase, *ngSwitchDefault, [ngSwitch]), one finding per element.
 */
const OLD = /^(?:\*ngIf|\*ngFor|\*ngSwitchCase|\*ngSwitchDefault|\[ngSwitch\])$/

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const a = [...el.attrs.values()].find((x) => OLD.test(x.raw))
      if (a) ctx.report(a.line, `${a.raw} is deprecated since Angular 20; use @if, @for or @switch (ng generate @angular/core:control-flow).`)
    }
  }
}
