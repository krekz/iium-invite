import React from 'react'
import { BookmarkIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface BookmarkButtonProps {
  eventId: string
  initialBookmarked?: boolean
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  eventId,
  initialBookmarked = false
}) => {
  const queryClient = useQueryClient()
  const { toast } = useToast();
  const router = useRouter();
  const { slug } = useParams()
  const loginPath = (path: string) => `/api/auth/signin?callbackUrl=/events/${path}`
  const { data: session } = useSession();

  const { mutate: toggleBookmark, isPending } = useMutation({
    mutationFn: async (isCurrentlyBookmarked: boolean) => {
      if (!session?.user) {
        router.push(loginPath(String(slug)));
        return false;
      }

      const response = await fetch('/api/user/bookmarks', {
        method: isCurrentlyBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId })
      })

      if (!response.ok) {
        throw new Error("Too many requests")
      }

      return !isCurrentlyBookmarked
    },
    onMutate: async (isCurrentlyBookmarked) => {
      if (!session?.user) return { previousBookmarked: false };

      await queryClient.cancelQueries({ queryKey: ['bookmarks', eventId] }) //cancel outgoing refetch
      const previousBookmarked = queryClient.getQueryData(['bookmarks', eventId]) // store previous value
      queryClient.setQueryData(['bookmarks', eventId], !isCurrentlyBookmarked) //optimisc update the ui

      return { previousBookmarked }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['bookmarks', eventId], context?.previousBookmarked)
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      })
    },
    // onSuccess: (newBookmarked) => {
    //   toast({
    //     title: newBookmarked ? 'Bookmark added' : 'Bookmark removed',
    //     variant: newBookmarked ? 'success' : 'destructive'
    //   })
    // }
  })

  // Only use initialBookmarked if user is logged in
  const isBookmarked = session?.user ? (queryClient.getQueryData(['bookmarks', eventId]) ?? initialBookmarked) : false

  const handleBookmarkClick = () => {
    if (!session?.user) {
      router.push(loginPath(String(slug)));
      return;
    }
    toggleBookmark(!!isBookmarked);
  };

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={isPending}
      className={cn(
        'flex items-center justify-center w-[10%] p-2 rounded-full transition-colors duration-200',
        isBookmarked ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        isPending && 'opacity-50'
      )}
      aria-label={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
    >
      <BookmarkIcon
        className={cn(
          'w-6 h-6',
          isBookmarked && 'fill-yellow-600'
        )}
      />
    </button>
  )
}

export default BookmarkButton