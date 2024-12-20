import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'
import prisma from './lib/prisma'

// protected routes that require authentication
const PROTECTED_ROUTES = {
    POST: '/post',
    ACCOUNT: '/account',
    VERIFY_EMAIL: '/verify-email'
} as const

export default async function middleware(request: NextRequest) {
    const session = await auth()
    const { pathname } = request.nextUrl

    const getSignInUrl = (callbackPath: string) => {
        const url = new URL('/api/auth/signin', request.url)
        url.searchParams.set('callbackUrl', callbackPath)
        return url
    }

    switch (true) {
        // route required authentication
        case !session?.user && (
            pathname.startsWith(PROTECTED_ROUTES.POST) ||
            pathname.startsWith(PROTECTED_ROUTES.ACCOUNT) ||
            pathname.startsWith(PROTECTED_ROUTES.VERIFY_EMAIL)
        ):
            return NextResponse.redirect(getSignInUrl(pathname))

        case !session?.user.emailVerified && pathname.startsWith(PROTECTED_ROUTES.POST): {
            return NextResponse.redirect(new URL('/verify-email', request.url))
        }

        case pathname.startsWith('/events'): {
            const eventId = pathname.split('/').pop()
            if (!eventId) {
                return NextResponse.error()
            }

            const event = await prisma.event.findUnique({
                where: { id: eventId },
                select: {
                    date: true,
                    authorId: true
                },
                cacheStrategy: {
                    ttl: 60 * 60 * 24 // 1 day cacbe
                }
            })

            // non existent events
            if (!event) {
                return NextResponse.error()
            }

            // expired events
            if (event.date && new Date(Date.now()) > new Date(event.date)) {
                if (!session?.user) {
                    return NextResponse.error()
                }
                if (session?.user.id !== event.authorId) {
                    return NextResponse.error()
                }
            }
            break
        }
        case pathname.startsWith("/verify-email"): {
            if (session?.user.emailVerified) return NextResponse.error()
        }
    }

    return NextResponse.next()
}

// Configure path matching
export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon\\.ico).*)',
    ],
}
