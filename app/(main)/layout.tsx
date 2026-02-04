import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ReactNode } from 'react'

export default async function MainLayout({
  children,
}: {
  children: ReactNode
}) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Auth error in layout:', error.message)
      redirect('/login')
    }

    if (!user) {
      redirect('/login')
    }

    return <>{children}</>
  } catch (error) {
    console.error('Error in MainLayout:', error)
    redirect('/login')
  }
}

