import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', 'avif']

function isImageRequest(path: string) {
  return imageExtensions.some(ext => path.toLowerCase().endsWith(ext))
}

const publicPages = [
  '/register',
  '/login',
  '/',
  '/landingpage',
  '/select-plan',
  '/checkout'
];

const gameMasterPages = [
  '/create/campaign',
  '/create/map'
];

export async function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const username = request.cookies.get('username')?.value
  const path = request.nextUrl.pathname;

  if (isImageRequest(path)) {
    return NextResponse.next()
  }
  
  // Check if user is trying to access a protected page without being logged in
  if (!isLoggedIn && !publicPages.includes(path)) {
    return NextResponse.redirect(new URL('/landingpage', request.url))
  }

  // Check permissions for Game Master features
  if (gameMasterPages.includes(path)) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/check-permissions?username=${username}`)
      const data = await response.json()
      
      if (!data.has_game_master) {
        return NextResponse.redirect(new URL('/select-plan', request.url))
      }
    } catch (error) {
      console.error('Error checking permissions:', error)
      return NextResponse.redirect(new URL('/select-plan', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 