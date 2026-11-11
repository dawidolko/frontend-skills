<script lang="ts">
  import * as v from 'valibot'

  const UserSchema = v.object({ id: v.string(), name: v.string() })
  let { id }: { id: string } = $props()

  async function loadUser() {
    const res = await fetch(`/api/users/${id}`)
    if (!res.ok) throw new Error(`Load failed: ${res.status}`)
    const body: unknown = await res.json()
    return v.parse(UserSchema, body)
  }

  const raw = JSON.parse(localStorage.getItem('flags') ?? '[]') as unknown
  const modes = JSON.parse('["a", "b"]') as const
  // const user = (await res.json()) as User in a comment is not code
</script>

<p>{id} {String(raw)} {modes}</p>
