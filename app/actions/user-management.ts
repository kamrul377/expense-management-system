'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type ManagedRole = 'SUPPORT' | 'MANAGER' | 'ACCOUNTS'

function canCreateRole(actorRole: string, targetRole: ManagedRole) {
  return actorRole === 'ADMIN' || (actorRole === 'MANAGER' && targetRole === 'SUPPORT')
}

export async function createManagedAccount(input: { name: string; email: string; password: string; role: ManagedRole }) {
  const session = await auth.api.getSession({ headers: await headers() })
  const actorRole = (session?.user as { role?: string } | undefined)?.role
  if (!session?.user || !actorRole || !canCreateRole(actorRole, input.role)) {
    return { error: 'You are not authorized to create this account.' }
  }

  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  if (name.length < 2 || !email.includes('@') || input.password.length < 8) {
    return { error: 'Enter a valid name, email, and password of at least 8 characters.' }
  }

  try {
    const result = await auth.api.signUpEmail({
      body: { name, email, password: input.password },
    })
    if (result.error || !result.user) return { error: 'Unable to create the account.' }
    await db.update(user).set({ role: input.role }).where(eq(user.id, result.user.id))
    return { success: true }
  } catch {
    return { error: 'Unable to create the account. The email may already be in use.' }
  }
}

export async function getCurrentRole() {
  const session = await auth.api.getSession({ headers: await headers() })
  return (session?.user as { role?: string } | undefined)?.role ?? null
}
