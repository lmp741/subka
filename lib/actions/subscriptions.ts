'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function getSubscriptions(userId: string): Promise<Subscription[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('next_billing_date', { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function createSubscription(
  userId: string,
  subscription: {
    name: string
    category: string
    amount: number
    currency: string
    billing_period: 'monthly' | 'yearly' | 'weekly' | 'daily'
    next_billing_date: string
  }
) {
  const supabase = await createClient()
  const subscriptionData: SubscriptionInsert = {
    user_id: userId,
    ...subscription,
    is_active: true,
  }
  // @ts-ignore - Supabase type inference issue
  const { data, error } = await (supabase as any)
    .from('subscriptions')
    .insert([subscriptionData])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { data }
}

export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<{
    name: string
    category: string
    amount: number
    currency: string
    billing_period: 'monthly' | 'yearly' | 'weekly' | 'daily'
    next_billing_date: string
    is_active: boolean
  }>
) {
  const supabase = await createClient()
  // @ts-ignore - Supabase type inference issue
  const { data, error } = await (supabase as any)
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { data }
}

export async function deleteSubscription(subscriptionId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', subscriptionId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
