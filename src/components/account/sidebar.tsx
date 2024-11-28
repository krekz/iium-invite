"use client"

import { User } from 'next-auth'
import Image from 'next/image'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Logout from '../Logout'

function Sidebar({ user }: { user: User | undefined }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentOption = searchParams.get('option') || 'informations'

    const handleOptionClick = (option: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('option', option.toLowerCase().replace(' ', '-'))
        router.push(`?${params.toString()}`)
    }

    return (
        <nav className='w-full md:w-1/3 flex flex-col items-center md:items-start'>
            <Image src={user?.image!} alt='thumbnail' width={80} height={80} className='rounded-full' />
            <p className='text-xl mt-1 font-medium text-center md:text-left'>{user?.name}</p>
            <p className='text-sm font-thin text-center md:text-left'>{user?.email}</p>

            <div className='flex flex-col mt-10 text-md gap-1'>
                <p
                    onClick={() => handleOptionClick('informations')}
                    className={`cursor-pointer hover:text-amber-800 ${currentOption === 'informations' ? 'text-amber-600 font-medium' : ''}`}
                >
                    Account Information
                </p>
                <p
                    onClick={() => handleOptionClick('posts')}
                    className={`cursor-pointer hover:text-amber-800 ${currentOption === 'posts' ? 'text-amber-600 font-medium' : ''}`}
                >
                    Posts
                </p>
                <p
                    onClick={() => handleOptionClick('bookmarks')}
                    className={`cursor-pointer hover:text-amber-800 ${currentOption === 'bookmarks' ? 'text-amber-600 font-medium' : ''}`}
                >
                    Bookmarks
                </p>

                <Logout />

            </div>
        </nav>
    )
}

export default Sidebar