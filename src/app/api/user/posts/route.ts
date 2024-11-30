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

        return NextResponse.json(posts, {
            headers: {
                'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Fetch posts error:', error)
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
}
