---
id: next/redirect-outside-try
title: Call redirect(), notFound() and their kin outside try blocks; they work by throwing, and a catch swallows them.
severity: serious
check: static
applies:
  - jsx
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, redirect (behavior)
    url: https://nextjs.org/docs/app/api-reference/functions/redirect
  - title: Next.js docs, unstable_rethrow
    url: https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow
---

## Why

`redirect()`, `permanentRedirect()`, `notFound()`, `forbidden()` and `unauthorized()` throw a special error that Next.js catches to change the response. Inside a `try` whose `catch` handles every error, that signal is caught by your code instead: the user stays on the page, sees a generic error message, or the action reports a failure after it succeeded.

## Fix

Do the risky work inside `try`, keep the result in a variable, and call `redirect()` after the `try`/`catch`. If the call must stay inside, call `unstable_rethrow(error)` first in the `catch`, or rethrow what you do not handle.

## Examples

```tsx
// bad
try { await createPost(data); redirect('/posts') } catch (error) { return { message: 'Could not save' } }
// good
try { await createPost(data) } catch (error) { return { message: 'Could not save' } }
revalidatePath('/posts')
redirect('/posts')
```
