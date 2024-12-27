"use client"
import Bookmarks from '@/components/account/bookmarks'
import Informations from '@/components/account/informations'
import Sidebar from '@/components/account/sidebar'
import UserPosts from '@/components/account/user-posts'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

const VIEW_OPTIONS = {
  INFORMATION: 'informations',
  POSTS: 'posts',
  BOOKMARKS: 'bookmarks',
} as const

type ViewOption = typeof VIEW_OPTIONS[keyof typeof VIEW_OPTIONS]

const MainContent = ({ currentView }: { currentView: ViewOption | string | string[] | undefined }) => {
  switch (currentView) {
    case VIEW_OPTIONS.POSTS:
      return <UserPosts />
    case VIEW_OPTIONS.BOOKMARKS:
      return <Bookmarks />
    case VIEW_OPTIONS.INFORMATION:
    default:
      return <Informations />
  }
}
function UserPage() {
  const user = useSession().data?.user
  const searchParams = useSearchParams()
  const currentView = searchParams.get('option') || VIEW_OPTIONS.INFORMATION

  const getPageTitle = () => {
    const firstName = user?.name?.split(' ')[0]
    switch (currentView) {
      case VIEW_OPTIONS.POSTS:
        return `${firstName}'s Posts`
      case VIEW_OPTIONS.BOOKMARKS:
        return `${firstName}'s Bookmarks`
      default:
        return `${firstName}'s Account`
    }
  }

  return (
    <div className='flex justify-between min-h-dvh py-3 px-4 sm:px-6'>
      <div className='flex flex-col w-full max-w-5xl mx-auto'>
        <header className='flex flex-col sm:flex-row justify-between w-full gap-4 sm:gap-0'>
          <h1 className='text-2xl font-semibold'>
            {getPageTitle()}
          </h1>
        </header>

        <hr className="w-full border-t border-gray-200 dark:border-gray-700 my-4" />

        <section className='flex flex-col md:flex-row md:justify-around gap-8 md:gap-4'>
          <Sidebar user={user} />
          <div className='w-full'>
            <MainContent currentView={currentView} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default UserPage