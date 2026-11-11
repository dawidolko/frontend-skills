---
id: next/server-action-checks
title: Every Server Action checks who is calling and what they may change, validates its input and returns only what the UI needs.
severity: serious
check: manual
applies:
  - jsx
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, Data Security (Server Actions, authentication, validating client input, return values)
    url: https://nextjs.org/docs/app/guides/data-security
  - title: Next.js docs, Server Actions guide
    url: https://nextjs.org/docs/app/guides/server-actions
---

## Why

A function marked `'use server'` and exported is a public HTTP endpoint: anyone can call it with any arguments, whether or not a page shows the button. A check that lives only in the page, the layout or `proxy.ts` does not protect it, a `FormData` value can be anything, and whatever the action returns is serialized to the browser.

## Fix

At the top of each action: read the session (`const session = await auth()`), refuse when it is missing, and check that the user may change this record (ownership or role). Parse the input with a schema (`z.object({...}).safeParse(Object.fromEntries(formData))`) and return field errors for `useActionState`. Return a small result (`{ ok: true }` or the errors), never a whole database row. Keep database access in a `server-only` data layer. Review by hand: a tool cannot tell whether the check is the right one.

## Examples

```ts
// bad
'use server'
export async function deletePost(id: string) { await db.post.delete({ where: { id } }) }
// good
'use server'
export async function deletePost(id: unknown) {
  const session = await auth()
  const postId = PostId.parse(id)
  if (!session || !(await canEditPost(session.user, postId))) return { ok: false }
  await db.post.delete({ where: { id: postId } })
  revalidatePath('/posts')
  return { ok: true }
}
```
