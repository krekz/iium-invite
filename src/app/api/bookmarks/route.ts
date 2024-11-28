import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { eventId } = await request.json()

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                userId: session?.user?.id!,
                eventId,
            }
        })

        return NextResponse.json(bookmark, { status: 201 })
    } catch (error) {
        console.error('Bookmark creation error:', error)

        // Handle unique constraint violation (already bookmarked)
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json({ error: 'Event already bookmarked' }, { status: 400 })
        }

        return NextResponse.json({ error: 'Failed to bookmark event' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: session?.user?.id },
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
        return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { eventId } = await request.json()

        const deletedBookmark = await prisma.bookmark.deleteMany({
            where: {
                userId: session?.user?.id,
                eventId
            }
        })

        if (deletedBookmark.count === 0) {
            return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Bookmark removed' })
    } catch (error) {
        console.error('Remove bookmark error:', error)
        return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
    }
}