// import { page } from '$app/stores' was the Kit 2 way
import { page } from '$app/state'

export const current = () => page.url.pathname
export const note = "use '$app/state' instead of '$app/stores'"
