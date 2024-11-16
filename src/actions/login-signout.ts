"use server"
import { signIn, signOut } from "@/auth"

export const SignOut = async ({ redirectTo }: { redirectTo: string }) => {
    await signOut({ redirectTo })
}

export const SignIn = async () => {
    await signIn()
}