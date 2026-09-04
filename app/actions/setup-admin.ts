'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { count, eq } from 'drizzle-orm'

export async function createInitialAdmin(input: { name: string; email: string; password: string }) {
  const [{ total }] = await db.select({ total: count() }).from(user)
  if (Number(total) > 0) return { error: 'Initial admin setup has already been completed.' }

  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  if (name.length < 2 || !email.includes('@') || input.password.length < 8) {
    return { error: 'Enter a valid name, email, and password of at least 8 characters.' }
  }

  try {
    const result = await auth.api.signUpEmail({ body: { name, email, password: input.password } })
    if (result.error || !result.user) return { error: 'Unable to create the initial administrator.' }
    await db.update(user).set({ role: 'ADMIN' }).where(eq(user.id, result.user.id))
    return { success: true }
  } catch {
    return { error: 'Unable to create the initial administrator.' }
  }
}

export async function isInitialAdminSetupAvailable() {
  const [{ total }] = await db.select({ total: count() }).from(user)
  return Number(total) === 0
}
