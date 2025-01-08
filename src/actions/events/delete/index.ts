"use server";

import { auth } from "@/actions/authentication/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/server-only";
import { createClient } from "@/lib/supabase/server";
import { validateEventId } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export const deletePost = async ({
	eventId,
}: { eventId: string }): Promise<{ success: boolean }> => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			console.error("[DeletePost] Unauthorized: No user session");
			return { success: false };
		}

		if (
			!checkRateLimit(session.user.id, {
				maxRequests: 2,
				windowMs: 30 * 1000,
			})
		) {
			console.error(
				"[DeletePost] Rate limit exceeded for user:",
				session.user.id,
			);
			return { success: false };
		}

		if (!validateEventId(eventId)) {
			console.error("[DeletePost] Invalid event ID format:", eventId);
			return { success: false };
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId },
			select: { authorId: true, poster_url: true },
		});

		if (!event) {
			console.error("[DeletePost] Event not found:", eventId);
			return { success: false };
		}

		if (event.authorId !== session.user.id) {
			console.error("[DeletePost] Unauthorized: User is not the author", {
				userId: session.user.id,
				authorId: event.authorId,
			});
			return { success: false };
		}

		await prisma.$transaction(async (tx) => {
			await tx.event.delete({
				where: { id: eventId },
			});

			const supabase = createClient();
			if (event.poster_url.length > 0) {
				const { error: fileError } = await supabase.storage
					.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "")
					.remove(event.poster_url);

				if (fileError) throw fileError;
			}
		});

		revalidateTag("events");

		return { success: true };
	} catch (error) {
		console.error("[DeletePost]", error);
		return { success: false };
	}
};
