import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from './lib/prisma'

// protected routes that require authentication
const PROTECTED_ROUTES = {
    POST: '/post',
    ACCOUNT: '/account',
    VERIFY_EMAIL: '/verify-email'
} as const

export default auth(async (request) => {
    const { pathname } = request.nextUrl
    const user = request.auth?.user

    const getSignInUrl = (callbackPath: string) => {
        const url = new URL('/api/auth/signin', request.url)
        url.searchParams.set('callbackUrl', callbackPath)
        return url
    }

    switch (true) {
        case !user && (
            pathname.startsWith(PROTECTED_ROUTES.POST) ||
            pathname.startsWith(PROTECTED_ROUTES.ACCOUNT) ||
            pathname.startsWith(PROTECTED_ROUTES.VERIFY_EMAIL)
        ):
            return NextResponse.redirect(getSignInUrl(pathname))

        case !user?.emailVerified && pathname.startsWith(PROTECTED_ROUTES.POST): {
            return NextResponse.redirect(new URL('/verify-email', request.url))
        }

        case pathname.startsWith('/events'): {
            const eventId = pathname.split('/').pop()
            if (!eventId) {
                return NextResponse.redirect(new URL('/404', request.url))
            }
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                select: {
                    isActive: true,
                    authorId: true
                },
                cacheStrategy: {
                    ttl: 15
                }
            })

            // non existent events
            if (!event) {
                return NextResponse.redirect(new URL('/404', request.url))
            }

            // expired events
            if (!event.isActive) {
                if (!user) {
                    return NextResponse.redirect(new URL('/404', request.url))
                }
                // only author can view expired events
                if (user.id !== event.authorId) {
                    return NextResponse.redirect(new URL('/404', request.url))
                }
            }
            break
        }
        case pathname.startsWith("/verify-email"): {
            if (user?.emailVerified) return NextResponse.redirect(new URL('/404', request.url))
        }
    }

    return NextResponse.next()
})

// Configure path matching
export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon\\.ico).*)',
    ],
}
