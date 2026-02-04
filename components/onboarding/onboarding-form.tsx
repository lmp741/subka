'use client'

import { useState } from 'react'
import { saveOnboardingResponses } from '@/lib/actions/onboarding'

const CATEGORIES = [
  {
    id: 'banks',
    name: 'Банки',
    services: ['Сбербанк', 'Тинькофф', 'Альфа-Банк', 'ВТБ'],
  },
  {
    id: 'music',
    name: 'Музыка',
    services: ['Apple Music', 'Яндекс Музыка', 'VK Музыка', 'Spotify'],
  },
  {
    id: 'video',
    name: 'Видео',
    services: ['Кинопоиск', 'Okko', 'Ivi', 'Netflix', 'YouTube Premium'],
  },
  {
    id: 'cloud',
    name: 'Облако',
    services: ['iCloud', 'Google One', 'Яндекс Диск', 'Dropbox'],
  },
  {
    id: 'education',
    name: 'Обучение',
    services: ['GeekBrains', 'Skillbox', 'Яндекс Практикум'],
  },
  {
    id: 'games',
    name: 'Игры',
    services: ['PS Plus', 'Xbox Game Pass'],
  },
]

export function OnboardingForm() {
  const [selectedServices, setSelectedServices] = useState<
    Record<string, string[]>
  >({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleService = (categoryId: string, service: string) => {
    setSelectedServices((prev) => {
      const categoryServices = prev[categoryId] || []
      const isSelected = categoryServices.includes(service)
      return {
        ...prev,
        [categoryId]: isSelected
          ? categoryServices.filter((s) => s !== service)
          : [...categoryServices, service],
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const responses = Object.entries(selectedServices)
        .filter(([_, services]) => services.length > 0)
        .map(([categoryId, services]) => {
          const category = CATEGORIES.find((c) => c.id === categoryId)
          return {
            category: category?.name || categoryId,
            services,
          }
        })

      await saveOnboardingResponses(responses)
    } catch (err) {
      setError('Произошла ошибка при сохранении')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {CATEGORIES.map((category) => (
        <div key={category.id} className="space-y-3">
          <h3 className="text-xl font-semibold">{category.name}</h3>
          <div className="grid grid-cols-2 gap-3">
            {category.services.map((service) => {
              const isSelected =
                selectedServices[category.id]?.includes(service) || false
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(category.id, service)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{service}</span>
                    {isSelected && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Сохранение...' : 'Завершить онбординг'}
      </button>
    </form>
  )
}

