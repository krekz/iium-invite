import { SessionProvider } from 'next-auth/react'
import { type Session } from 'next-auth'
import React from 'react'

const NextSessionProvider = ({ children, session }: { children: React.ReactNode, session?: Session | null }) => {
    return (
        <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false} >{children}</SessionProvider>
    )
}

export default NextSessionProvider