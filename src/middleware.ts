import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
	const { url, cookies } = request

	const session = cookies.get('session')?.value

	const isAuthPath = url.includes('/auth')

	if (isAuthPath) {
		if (session) {
			return NextResponse.redirect(new URL('/dashboard/settings', url))
		}

		return NextResponse.next()
	}

    if(!session){
        return NextResponse.redirect(new URL('/auth/login', url))
    }
}

export const config = {
	matcher: ['/auth/:path*', '/dashboard/:path*', '/friends/:path*', '/theme/:path*', '/summary/:path*', '/groups/:path*']
}
