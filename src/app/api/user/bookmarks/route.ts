import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/server-only'

const bookmarkSchema = z.object({
    eventId: z.string().regex(/^post-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
})

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!checkRateLimit(session.user!.id!, { maxRequests: 5, windowMs: 30 * 1000 })) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
        }

        const body = await request.json()
        const validationResult = bookmarkSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { eventId } = validationResult.data

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        const existingBookmark = await prisma.bookmark.findFirst({
            where: {
                userId: session.user!.id,
                eventId
            }
        })

        if (existingBookmark) {
            return NextResponse.json({ error: 'Event already bookmarked' }, { status: 400 })
        }

        await prisma.$transaction(async (tx) => {
            await tx.bookmark.create({
                data: {
                    userId: session.user!.id!,
                    eventId,
                }
            })
        })

        return NextResponse.json({ message: "Bookmarked" }, { status: 201 })

    } catch (error) {
        console.error('Bookmark creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!checkRateLimit(session.user.id)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId: session.user.id,
                // Ensure the event still exists
                event: {
                    id: { not: undefined }
                }
            },
            select: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        poster_url: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(bookmarks)

    } catch (error) {
        console.error('Fetch bookmarks error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!checkRateLimit(session.user.id, { maxRequests: 5, windowMs: 30 * 1000 })) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
        }

        const body = await request.json()
        const validationResult = bookmarkSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { eventId } = validationResult.data

        const result = await prisma.$transaction(async (tx) => {
            return await tx.bookmark.deleteMany({
                where: {
                    userId: session.user!.id!,
                    eventId
                }
            })
        })

        if (result.count === 0) {
            return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Bookmark removed' }, { status: 200 })

    } catch (error) {
        console.error('Remove bookmark error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}