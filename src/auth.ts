import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import google from "next-auth/providers/google"
import { cache } from "react"

declare module "next-auth" {
	interface Session {
		user: {
			/** The user's postal address. */
			emailVerified: boolean
			/**
			 * By default, TypeScript merges new interface properties and overwrites existing ones.
			 * In this case, the default session user properties will be overwritten,
			 * with the new ones defined above. To keep the default session user properties,
			 * you need to add them back into the newly declared interface.
			 */
		} & DefaultSession["user"]
	}

}

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [google],

	callbacks: {
		session({ session, user }) {
			return {
				expires: session.expires,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					emailVerified: user.emailVerified
				}
			}
		},
	}
})

export const getAuth = cache(async () => {
	const session = await auth()
	return session
})