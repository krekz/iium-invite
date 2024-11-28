"use client"
import { SignOut } from '@/actions/login-signout'
import { LogOut } from 'lucide-react'
import { Button } from './ui/button'

function Logout() {
    return (
        <form action={async () => await SignOut({ redirectTo: "/" })}>
            <Button
                variant={"destructive"}
                className="rounded-lg w-full mt-10 py-2 flex items-center gap-2"
            >
                <LogOut className="size-5" />
                <span className="font-medium">Sign Out</span>
            </Button>
        </form>
    )
}

export default Logout