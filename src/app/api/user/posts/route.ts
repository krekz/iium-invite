import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const posts = await prisma.event.findMany({
            where: {
                authorId: session.user?.id
            },
            select: {
                id: true,
                title: true,
                organizer: true,
                location: true,
                poster_url: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!posts || posts.length === 0) {
            return NextResponse.json({ error: 'No posts found' }, { status: 404 })
        }

        return NextResponse.json(posts)
    } catch (error) {
        console.error('Fetch posts error:', error)
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
}
