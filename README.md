# Subscription Controller

PWA-приложение для управления подписками для пользователей из стран СНГ.

## Технологии

- Next.js 14 (App Router)
- TypeScript
- Supabase (Postgres, Auth, RLS)
- @supabase/ssr
- Tailwind CSS
- PWA

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Локальное тестирование без Supabase

Для тестирования приложения без подключения к Supabase можно временно отключить проверку аутентификации:

### Вариант 1: Временное отключение middleware

Временно закомментируйте проверку пользователя в `middleware.ts`:

```typescript
// Временно отключено для локального тестирования
// const {
//   data: { user },
// } = await supabase.auth.getUser()

// if (!user && !isAuthPage && !isPublicPage && !isCallbackPage) {
//   const url = request.nextUrl.clone()
//   url.pathname = '/login'
//   return NextResponse.redirect(url)
// }

// if (user && isAuthPage) {
//   const url = request.nextUrl.clone()
//   url.pathname = '/dashboard'
//   return NextResponse.redirect(url)
// }
```

### Вариант 2: Мок-данные в layout

В `app/(main)/layout.tsx` временно закомментируйте проверку:

```typescript
// Временно отключено для локального тестирования
// const supabase = await createClient()
// const {
//   data: { user },
// } = await supabase.auth.getUser()

// if (!user) {
//   redirect('/login')
// }
```

### Вариант 3: Использование переменной окружения

Создайте `.env.local` с флагом для разработки:

```env
NEXT_PUBLIC_SKIP_AUTH=true
```

И обновите `middleware.ts`:

```typescript
const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true'

if (!skipAuth) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // ... остальная логика
}
```

## Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## Структура проекта

```
app/
  (auth)/          # Страницы аутентификации
  (main)/          # Защищенные страницы
    dashboard/     # Дашборд с подписками
    onboarding/    # Онбординг
components/        # React компоненты
lib/
  actions/         # Server Actions
  supabase/        # Supabase клиенты
types/             # TypeScript типы
```

## Деплой

Проект настроен для деплоя на Vercel. При пуше в `main` ветку автоматически запускается деплой.

