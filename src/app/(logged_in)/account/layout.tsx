import { SessionProvider } from "next-auth/react"

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <SessionProvider>{children}</SessionProvider>
}