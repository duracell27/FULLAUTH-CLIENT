import { NextRequest, NextResponse } from 'next/server'
import { cookieUtils } from './shared/utils/cookie'

export default function middleware(request: NextRequest) {
	const { url, cookies } = request

	const session = cookies.get('session')?.value
	const language = cookieUtils.getLanguageFromCookie(request.headers.get('cookie') || undefined)

	const isAuthPath = url.includes('/auth')

	// Додаємо мову в заголовки для серверних компонентів
	const response = NextResponse.next()
	response.headers.set('x-language', language)

	if (isAuthPath) {
		if (session) {
			return NextResponse.redirect(new URL('/groups', url))
		}

		return response
	}

    if(!session){
        return NextResponse.redirect(new URL('/auth/login', url))
    }

	return response
}

export const config = {
	matcher: ['/auth/:path*', '/dashboard/:path*', '/friends/:path*', '/theme/:path*', '/summary/:path*', '/groups/:path*', '/expenses/:path*']
}
