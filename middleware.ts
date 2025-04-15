import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value

	if (
		!token &&
		request.nextUrl.pathname !== '/login' &&
		request.nextUrl.pathname !== '/register' &&
		request.nextUrl.pathname !== '/token' &&
		request.nextUrl.pathname !== '/home' &&
		!request.nextUrl.pathname.includes('/vote')
	) {
		return Response.redirect(new URL('/home', request.url))
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
