'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/actions/auth'

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const result = await signUp(email, password, fullName)
        if (result?.error) {
          setError(result.error)
        }
      } else {
        const result = await signIn(email, password)
        if (result?.error) {
          setError(result.error)
        }
      }
    } catch (err) {
      setError('Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Имя
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="Ваше имя"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="Минимум 6 символов"
        />
      </div>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Загрузка...' : isSignUp ? 'Зарегистрироваться' : 'Войти'}
      </button>
      <button
        type="button"
        onClick={() => {
          setIsSignUp(!isSignUp)
          setError(null)
        }}
        className="w-full text-sm text-muted-foreground hover:text-foreground"
      >
        {isSignUp
          ? 'Уже есть аккаунт? Войти'
          : 'Нет аккаунта? Зарегистрироваться'}
      </button>
    </form>
  )
}

