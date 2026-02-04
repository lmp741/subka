import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile, getSubscriptions } from '@/lib/actions/subscriptions'
import { SubscriptionCard } from '@/components/ui/subscription-card'
import { AuthButton } from '@/components/ui/auth-button'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Auth error:', authError.message)
      redirect('/login')
    }

    if (!user) {
      redirect('/login')
    }

    const profile = await getProfile(user.id)

    if (profile && !profile.onboarding_completed) {
      redirect('/onboarding')
    }

    const subscriptions = await getSubscriptions(user.id)

    const totalMonthly = subscriptions.reduce((sum, sub) => {
      if (sub.billing_period === 'monthly') {
        return sum + sub.amount
      } else if (sub.billing_period === 'yearly') {
        return sum + sub.amount / 12
      } else if (sub.billing_period === 'weekly') {
        return sum + sub.amount * 4
      } else {
        return sum + sub.amount * 30
      }
    }, 0)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Дашборд</h1>
        <AuthButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Всего подписок</p>
          <p className="text-2xl font-bold">{subscriptions.length}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">В месяц</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            }).format(totalMonthly)}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Активных</p>
          <p className="text-2xl font-bold">
            {subscriptions.filter((s) => s.is_active).length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Мои подписки</h2>
        {subscriptions.length === 0 ? (
          <p className="text-muted-foreground">
            У вас пока нет подписок. Пройдите онбординг или добавьте подписку
            вручную.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <SubscriptionCard key={subscription.id} subscription={subscription} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
  } catch (error) {
    console.error('Error in DashboardPage:', error)
    redirect('/login')
  }
}
