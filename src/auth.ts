import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import google from "next-auth/providers/google"
import { cache } from "react"
declare module "next-auth" {
	interface Session {
		user: {
			isVerified: boolean | null
		} & DefaultSession["user"]
	}

	interface User {
		isVerified?: boolean
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [google],
	session: {
		strategy: "jwt",
		maxAge: 7 * 24 * 60 * 60, // 7 days
	},
	callbacks: {
		jwt({ token, user, trigger, session }) {
			if (user) {
				token.id = user.id
				token.isVerified = user.isVerified
			}
			if (trigger === "update" && session) {
				token.isVerified = session.user.isVerified
			}
			return token
		},
		session({ session, token }) {
			return {
				expires: session.expires,
				user: {
					id: token.id as string,
					name: token.name,
					email: token.email,
					image: token.picture,
					isVerified: token.isVerified as boolean,
				}
			}
		}
	}
})


export const getAuth = cache(async () => {
	const session = await auth()
	return session
})