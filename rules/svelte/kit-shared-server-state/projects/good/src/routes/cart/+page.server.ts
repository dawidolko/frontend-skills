import type { Actions, PageServerLoad } from './$types'
import { db } from '#lib/server/db.js'

const PAGE_SIZE = 20
const config = { currency: 'EUR' }
const limiter = new Map<string, number>()
let requests = 0
const featured: string[] = []
for (const id of ['a', 'b']) {
  featured.push(id)
}
if (featured.length > 1) {
  requests = featured.length
}

export const load: PageServerLoad = async ({ locals, url }) => {
  let page = Number(url.searchParams.get('page') ?? 1)
  if (page < 1) page = 1
  const cart = await db.cart.list(locals.user.id, { page, size: PAGE_SIZE })
  limiter.set(locals.user.id, Date.now())
  return { cart, currency: config.currency, requests }
}

export const actions: Actions = {
  add: async ({ request, locals }) => {
    const items: string[] = []
    items.push(String((await request.formData()).get('id')))
    await db.cart.add(locals.user.id, items)
  }
}
