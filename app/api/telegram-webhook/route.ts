import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // TODO: Implement Telegram webhook handler for reminders
  return NextResponse.json({ ok: true })
}

