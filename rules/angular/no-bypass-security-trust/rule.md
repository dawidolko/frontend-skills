---
id: angular/no-bypass-security-trust
title: DomSanitizer bypassSecurityTrust* calls never receive user or server data; each one is a reviewed exception.
severity: serious
check: manual
applies:
  - angular
stack:
  - angular
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Security (trusting safe values)
    url: https://angular.dev/best-practices/security
  - title: Angular API, DomSanitizer
    url: https://angular.dev/api/platform-browser/DomSanitizer
---

## Why

Angular sanitizes every value bound into `[innerHTML]`, `[href]`, `[src]` and `[style]`. `bypassSecurityTrustHtml`, `…Url`, `…ResourceUrl`, `…Script` and `…Style` switch that off for one value: if any part of it comes from a user, a URL or an API, it is cross-site scripting.

## Fix

Bind the value without bypassing (`[innerHTML]="html"` is sanitized and keeps safe markup). Bypass only constants you wrote (an embed URL built from a fixed origin and a validated id), keep the call in one small function with a comment that says why it is safe, and never pass `ElementRef.nativeElement.innerHTML` raw strings either. Manual because the engine does not read `.ts` files: search for `bypassSecurityTrust` and review each call.

## Examples

```ts
// bad
this.body = this.sanitizer.bypassSecurityTrustHtml(comment.html)
// good
body = computed(() => this.comment().html) // bound with [innerHTML], which sanitizes
```
