// throw 'x' in a comment is not code
export class HttpError extends Error {
  constructor(status, message, options) {
    super(message, options)
    this.status = status
  }
}

export async function loadUser(id, error) {
  const res = await fetch(`/api/users/${id}`)
  if (res.status === 404) throw error(404, 'Not found')
  if (!res.ok) throw new HttpError(res.status, 'Load failed')
  const label = "throw 'nothing'"
  return res.ok ? res.json() : Promise.reject(new HttpError(res.status, label))
}
