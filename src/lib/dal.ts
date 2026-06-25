import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt, type SessionPayload } from './auth'
import { prisma } from './prisma'

/**
 * Data Access Layer - verifies session and returns user info.
 * Uses React cache() so it only runs once per request.
 */
export const verifySession = cache(async (): Promise<{
  isAuth: true
  userId: string
  role: string
} | null> => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return null
  }

  return { isAuth: true, userId: session.userId, role: session.role }
})

/**
 * Require authentication - redirects to login if not authenticated.
 */
export async function requireAuth() {
  const session = await verifySession()
  if (!session) {
    redirect('/login')
  }
  return session
}

/**
 * Require specific role(s) - redirects if user doesn't have required role.
 */
export async function requireRole(roles: string[]) {
  const session = await requireAuth()
  if (!roles.includes(session.role)) {
    redirect('/panel')
  }
  return session
}

/**
 * Get current user with full profile from DB.
 */
export const getCurrentUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      avatarUrl: true,
    },
  })

  return user
})
