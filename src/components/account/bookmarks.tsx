"use client"
import { useQuery } from "@tanstack/react-query"
import { Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Bookmark {
  event: {
    id: string
    title: string
    poster_url: string[] | string
  }
}

function Bookmarks() {
  const { data, isLoading } = useQuery<Bookmark[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const res = await fetch('/api/user/bookmarks')
      if (!res.ok) {
        throw new Error('Failed to fetch bookmarks')
      }
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-100 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-lg font-semibold">Loading bookmarks...</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-500">No bookmarks yet</p>
          <p className="text-sm text-gray-400">Bookmark events to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3">
      {data.map(bookmark => (
        <Link
          key={bookmark.event.id}
          href={`/events/${bookmark.event.id}`}
          className="block relative aspect-square rounded-lg overflow-hidden group">
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucket-v1/${bookmark.event.poster_url[0]}`}
            alt={bookmark.event.title}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            quality={60}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center gap-2 text-white">
              <Bookmark className="w-5 h-5" fill="brown" />
              <span className="font-medium truncate">{bookmark.event.title}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Bookmarks