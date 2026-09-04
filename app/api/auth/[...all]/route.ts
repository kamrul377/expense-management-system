import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { count } from 'drizzle-orm'
import { toNextJsHandler } from 'better-auth/next-js'
import { NextRequest, NextResponse } from 'next/server'

const handler = toNextJsHandler(auth)

export async function GET(request: NextRequest) {
  return handler.GET(request)
}

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith('/sign-up/email')) {
    const [{ total }] = await db.select({ total: count() }).from(user)
    if (Number(total) > 0) {
      return NextResponse.json({ error: { message: 'Public account creation is disabled.' } }, { status: 403 })
    }
  }
  return handler.POST(request)
}
