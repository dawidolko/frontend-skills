import type { Actions, PageServerLoad } from './$types'

let currentUser: string | null = null
const cart: string[] = []

export const load: PageServerLoad = async ({ locals }) => {
  currentUser = locals.user?.name ?? null
  return { user: currentUser, cart }
}

export const actions: Actions = {
  add: async ({ request }) => {
    cart.push(String((await request.formData()).get('id')))
  }
}
