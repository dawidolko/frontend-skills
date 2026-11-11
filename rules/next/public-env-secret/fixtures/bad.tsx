import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!)
export const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!)
