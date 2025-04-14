import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define the paths for user and admin
  const isUserPublicPath = path === '/form/signup' || path === '/form/signin'
  const isAdminLoginPath = path === '/form/adminlogin'
  const isAdminPath = path.startsWith('/admin')

  // Get tokens from cookies
  const token = request.cookies.get("token")?.value || ""
  const adminToken = request.cookies.get("adminToken")?.value || ""

  // USER: Redirect logged-in users away from signup/signin
  if (isUserPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // ADMIN: Handle admin login path
  if (isAdminLoginPath) {
    // Allow access to admin login page if no adminToken
    if (!adminToken) {
      return NextResponse.next()
    }
    // Redirect to admin dashboard if already logged in
    return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl))
  }

  // ADMIN: Protect admin routes
  if (isAdminPath) {
    // Allow access if adminToken exists
    if (adminToken) {
      return NextResponse.next()
    }
    // Redirect to admin login if no adminToken
    return NextResponse.redirect(new URL('/form/adminlogin', request.nextUrl))
  }

  // USER: Protect user routes (non-public, non-admin)
  if (!isUserPublicPath && !isAdminPath && !token) {
    return NextResponse.redirect(new URL('/form/signin', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/form/signup',
    '/form/signin',
    '/form/adminlogin',
    '/profile',
    '/admin/:path*'
  ]
}