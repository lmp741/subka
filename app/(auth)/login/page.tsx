import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Subscription Controller</h1>
          <p className="mt-2 text-muted-foreground">
            Войдите в свой аккаунт
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

