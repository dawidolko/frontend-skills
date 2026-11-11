import 'server-only'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// NEXT_PUBLIC_STRIPE_SECRET_KEY in a comment is not code
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export const publicClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
export const label = 'NEXT_PUBLIC_PASSWORD'
