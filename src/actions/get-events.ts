"use server"

import prisma from "@/lib/prisma"
import { unstable_cache } from 'next/cache'

type SearchParams = {
    q?: string
    category?: string
    campus?: string
    fee?: string
    has_starpoints?: string
}

export async function getEvents(searchParams?: SearchParams) {
    const searchQuery = searchParams?.q?.trim() || undefined;
    const category = searchParams?.category?.toLowerCase();
    const campus = searchParams?.campus?.toLowerCase();
    const fee = searchParams?.fee;
    const hasStarpoints = searchParams?.has_starpoints === 'true';

    const getCachedEvents = unstable_cache(
        async () => {
            try {
                const events = await prisma.event.findMany({
                    where: {
                        AND: [
                            searchQuery ? {
                                OR: [
                                    { title: { contains: searchQuery, mode: 'insensitive' } },
                                    { description: { contains: searchQuery, mode: 'insensitive' } },
                                    { organizer: { contains: searchQuery, mode: 'insensitive' } },
                                    { location: { contains: searchQuery, mode: 'insensitive' } },
                                    { categories: { hasSome: [searchQuery.toLowerCase()] } }
                                ],
                                NOT: {
                                    AND: [
                                        { title: { not: { contains: searchQuery }, mode: 'insensitive' } },
                                        { description: { not: { contains: searchQuery }, mode: 'insensitive' } },
                                        { organizer: { not: { contains: searchQuery }, mode: 'insensitive' } },
                                        { location: { not: { contains: searchQuery }, mode: 'insensitive' } },
                                    ]
                                }
                            } : {},
                            category ? {
                                categories: {
                                    hasSome: [category]
                                }
                            } : {},
                            campus ? {
                                campus: {
                                    equals: campus,
                                    mode: 'insensitive'
                                }
                            } : {},
                            fee ? {
                                fee: fee === '0' ? '0' : { gt: "0" }
                            } : {},
                            searchParams?.has_starpoints ? {
                                has_starpoints: hasStarpoints
                            } : {}
                        ]
                    },
                    orderBy: [
                        { title: 'asc' },
                        { description: 'asc' },
                        { categories: 'asc' },
                        { location: 'asc' },
                        { organizer: 'asc' },
                    ],
                    select: {
                        id: true,
                        title: true,
                        organizer: true,
                        location: true,
                        categories: true,
                        date: true,
                        poster_url: true,
                        has_starpoints: true,
                    }
                });
                return events;
            } catch (error) {
                console.error("Error fetching events:", error);
                return [];
            }
        },
        ['events-list', searchQuery || "", category || "", campus || "", fee || "", hasStarpoints.toString()],
        {
            revalidate: 60,
            tags: ['events']
        }
    );

    return getCachedEvents();
}