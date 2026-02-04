'use client'

import { signOut } from '@/lib/actions/auth'

export function AuthButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Выйти
      </button>
    </form>
  )
}

