export async function loadUsers() {
  const res = await fetch('/api/users')
  return res.json()
}

export async function loadPosts() {
  return (await fetch('/api/posts')).json()
}

export function loadTags() {
  return fetch('/api/tags').then((r) => r.json())
}
