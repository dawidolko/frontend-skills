export async function loadUser(id) {
  const res = await fetch(`/api/users/${id}`)
  if (res.status === 404) throw `User ${id} not found`
  if (!res.ok) throw { status: res.status }
  return res.ok ? res.json() : Promise.reject('failed')
}
