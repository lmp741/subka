import { Database } from '@/types/database'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

interface SubscriptionCardProps {
  subscription: Subscription
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="border border-border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{subscription.name}</h3>
          <p className="text-sm text-muted-foreground">{subscription.category}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            {formatAmount(subscription.amount, subscription.currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            / {subscription.billing_period === 'monthly' ? 'мес' : subscription.billing_period === 'yearly' ? 'год' : subscription.billing_period}
          </p>
        </div>
      </div>
      <div className="pt-2 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Следующее списание: <span className="font-medium text-foreground">{formatDate(subscription.next_billing_date)}</span>
        </p>
      </div>
    </div>
  )
}

