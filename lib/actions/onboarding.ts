'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'

type OnboardingResponseInsert = Database['public']['Tables']['onboarding_responses']['Insert']
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']

const PREDEFINED_SUBSCRIPTIONS: Record<
  string,
  { price: number; currency: string; category: string }
> = {
  'Apple Music': { price: 169, currency: 'RUB', category: 'Музыка' },
  'Яндекс Музыка': { price: 299, currency: 'RUB', category: 'Музыка' },
  'VK Музыка': { price: 149, currency: 'RUB', category: 'Музыка' },
  Spotify: { price: 169, currency: 'RUB', category: 'Музыка' },
  Кинопоиск: { price: 299, currency: 'RUB', category: 'Видео' },
  Okko: { price: 399, currency: 'RUB', category: 'Видео' },
  Ivi: { price: 399, currency: 'RUB', category: 'Видео' },
  Netflix: { price: 599, currency: 'RUB', category: 'Видео' },
  'YouTube Premium': { price: 249, currency: 'RUB', category: 'Видео' },
  iCloud: { price: 59, currency: 'RUB', category: 'Облако' },
  'Google One': { price: 139, currency: 'RUB', category: 'Облако' },
  'Яндекс Диск': { price: 150, currency: 'RUB', category: 'Облако' },
  Dropbox: { price: 850, currency: 'RUB', category: 'Облако' },
  GeekBrains: { price: 4500, currency: 'RUB', category: 'Обучение' },
  Skillbox: { price: 5000, currency: 'RUB', category: 'Обучение' },
  'Яндекс Практикум': { price: 15000, currency: 'RUB', category: 'Обучение' },
  'PS Plus': { price: 529, currency: 'RUB', category: 'Игры' },
  'Xbox Game Pass': { price: 600, currency: 'RUB', category: 'Игры' },
}

export async function saveOnboardingResponses(
  responses: Array<{ category: string; services: string[] }>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Пользователь не авторизован' }
  }

  // Сохраняем ответы онбординга
  const onboardingData: OnboardingResponseInsert[] = responses.map((r) => ({
    user_id: user.id,
    category: r.category,
    services: r.services,
  }))

  // @ts-expect-error - Supabase type inference issue
  const { error: onboardingError } = await supabase
    .from('onboarding_responses')
    .insert(onboardingData)

  if (onboardingError) {
    return { error: onboardingError.message }
  }

  // Создаем подписки из выбранных сервисов
  const nextPaymentDate = new Date()
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 30)
  const nextPaymentDateString = nextPaymentDate.toISOString().split('T')[0]

  const subscriptionsToInsert: SubscriptionInsert[] = responses
    .flatMap((r) => r.services)
    .filter((name) => PREDEFINED_SUBSCRIPTIONS[name])
    .map((name) => {
      const service = PREDEFINED_SUBSCRIPTIONS[name]
      return {
        user_id: user.id,
        name: name,
        category: service.category,
        amount: service.price,
        currency: service.currency,
        billing_period: 'monthly' as const,
        next_billing_date: nextPaymentDateString,
        is_active: true,
      }
    })

  if (subscriptionsToInsert.length > 0) {
    // @ts-expect-error - Supabase type inference issue
    const { error: subscriptionsError } = await supabase
      .from('subscriptions')
      .insert(subscriptionsToInsert)

    if (subscriptionsError) {
      return { error: subscriptionsError.message }
    }
  }

  // Обновляем профиль - отмечаем онбординг как завершенный
  // @ts-expect-error - Supabase type inference issue
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

