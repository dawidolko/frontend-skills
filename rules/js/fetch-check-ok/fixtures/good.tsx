async function getJson(res: Response) {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export async function loadUsers(signal: AbortSignal) {
  const res = await fetch('/api/users', { signal })
  if (!res.ok) throw new Error(`GET /api/users failed: ${res.status}`)
  return res.json()
}

export async function loadPosts() {
  const response = await fetch('/api/posts')
  return getJson(response)
}

export async function loadTags() {
  const data = await $fetch('/api/tags')
  return fetch('/api/tags').then(getJson).then(() => data)
}

export async function loadError() {
  const res = await fetch('/api/me')
  const body = await res.json()
  if (res.status === 401) return null
  return body
}
