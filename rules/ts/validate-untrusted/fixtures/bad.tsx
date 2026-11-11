type User = { id: string; name: string }
type Settings = { theme: 'light' | 'dark' }

export async function loadUser(id: string) {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error(`Load failed: ${res.status}`)
  return (await res.json()) as User
}

export function readSettings() {
  const settings: Settings = JSON.parse(localStorage.getItem('settings') ?? '{}')
  return settings
}
