---
id: js/no-empty-catch
title: A catch block never swallows an error silently; handle it, report it, or say in a comment why it is safe to ignore.
severity: moderate
check: static
applies:
  - jsx
  - html
  - vue
  - svelte
  - astro
skill: fe-javascript
since: 0.1.0
sources:
  - title: MDN, try...catch
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
  - title: ESLint, no-empty (an empty block with a comment is allowed)
    url: https://eslint.org/docs/latest/rules/no-empty
---

## Why

An empty `catch {}` or `.catch(() => {})` turns a failure into nothing: the button stops working, the form never submits, and neither the user nor the error tracker hears about it. Debugging starts from "it does nothing".

## Fix

Show the user a recoverable state (an error message with a retry), report the error to your logger, or rethrow it with context (`throw new Error('Saving failed', { cause: err })`). If ignoring it is correct (an optional feature that may be missing), write a comment in the block that says why.

## Examples

```js
// bad
try { await save(form) } catch {}
// good
try { await save(form) } catch (err) { showError('Could not save. Try again.'); report(err) }
try { localStorage.setItem('seen', '1') } catch { /* storage may be disabled; the banner just shows again */ }
```
