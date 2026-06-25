// proxy.ts — Next.js 16 replaces middleware.ts with proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

const protectedRoutes = ['/panel', '/mis-cursos', '/cursos', '/certificados', '/perfil']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/registro', '/recuperar-clave']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route))

  // Get session from cookie
  const cookie = request.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // Redirect unauthenticated users from protected routes to login
  if ((isProtectedRoute || isAdminRoute) && !session?.userId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect non-admin users from admin routes
  if (isAdminRoute && session?.role !== 'ADMIN' && session?.role !== 'TEACHER') {
    return NextResponse.redirect(new URL('/panel', request.url))
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && session?.userId) {
    if (session.role === 'ADMIN' || session.role === 'TEACHER') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/panel', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
