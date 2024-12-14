"use server";

import { createClient } from "@/lib/supabase/server";
import { descSchema, detailSchema, postSchema } from "@/lib/validations/post";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/server-only";
import { unstable_cache } from 'next/cache';

type Input = {
	formData: FormData;
};

type TUpdateDescription = {
	formData: FormData,
	eventId: string
}

type TUpdateDetails = {
	formData: FormData,
	eventId: string,
}

type FormDataValues = Record<string, FormDataEntryValue | FormDataEntryValue[] | boolean>;

// Cache events for 1 minute
const getCachedEvents = unstable_cache(
	async () => {
		return await prisma.event.findMany({
			take: 7,
			select: {
				id: true,
				poster_url: true
			}
		});
	},
	['events-cache'],
	{ revalidate: 60 }
);

export const CreatePost = async (input: Input): Promise<{ success: boolean; message: string; eventId: string }> => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("You must be logged in to do that");
		}

		if (!checkRateLimit(session.user.id, { maxRequests: 2 })) {
			throw new Error("Too many requests. Please try again later.");
		}

		const { formData } = input;
		const values: FormDataValues = Object.fromEntries(formData.entries());

		values.poster_url = formData.getAll("poster_url").filter(Boolean);
		values.categories = formData.getAll("categories").filter(Boolean);

		const contactsString = formData.get("contacts");
		values.contacts = [];
		if (typeof contactsString === "string") {
			try {
				const parsed = JSON.parse(contactsString);
				if (Array.isArray(parsed)) {
					values.contacts = parsed;
				}
			} catch (error) {
				console.error("Error parsing contacts:", error);
			}
		}

		values.has_starpoints = values.has_starpoints === 'true';

		const { title, campus, categories, date, description, fee, has_starpoints, location, organizer, poster_url, registration_link, contacts } = postSchema.parse(values)

		const assignPostId = `post-${uuidv4()}`;
		const supabase = createClient();

		const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
		const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

		const uploadedFiles = await Promise.all(poster_url.map(async (file) => {
			if (!ALLOWED_TYPES.includes(file.type)) {
				throw new Error("Invalid file type. Only JPEG, PNG and WebP allowed.");
			}
			if (file.size > MAX_FILE_SIZE) {
				throw new Error("File too large. Maximum size is 5MB.");
			}

			const filePath = `${assignPostId}/${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
			const { data, error } = await supabase.storage
				.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false
				});

			if (error) throw error;
			return data.path;
		}));

		// Create event with transaction to ensure atomicity
		const newEvent = await prisma.$transaction(async (tx) => {
			const event = await tx.event.create({
				data: {
					id: assignPostId,
					authorId: session.user!.id!,
					title,
					campus,
					categories: categories.map(cat => cat.toLowerCase()),
					date,
					description,
					fee,
					has_starpoints,
					location,
					organizer,
					poster_url: uploadedFiles,
					registration_link,
					contacts: {
						create: contacts.map((contact) => ({
							name: contact.name.slice(0, 100), // Limit length
							phone: contact.phone.slice(0, 20),
						})),
					},
				}
			});
			return event;
		});

		revalidatePath("/discover");
		revalidatePath("/");

		return {
			success: true,
			message: "Post created successfully",
			eventId: newEvent.id
		};
	} catch (error) {
		console.error("[CreatePost]", error);
		return { success: false, message: "Failed to create post", eventId: "" };
	}
};

export const deletePost = async ({ eventId }: { eventId: string }): Promise<{ success: boolean }> => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("You must be logged in to do that");
		}

		if (!checkRateLimit(session.user.id, { maxRequests: 2, windowMs: 30 * 1000 })) {
			throw new Error("Too many requests. Please try again later.");
		}

		if (!/^post-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)) {
			throw new Error("Invalid event ID format");
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId },
			select: { authorId: true, poster_url: true }
		});

		if (!event) {
			throw new Error("Event not found");
		}

		if (event.authorId !== session.user.id) {
			throw new Error("You must be the author to delete this post");
		}

		await prisma.$transaction(async (tx) => {
			await tx.event.delete({
				where: { id: eventId }
			});

			const supabase = createClient();
			if (event.poster_url.length > 0) {
				const { error: fileError } = await supabase.storage
					.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
					.remove(event.poster_url);

				if (fileError) throw fileError;
			}
		});

		revalidatePath("/discover");
		revalidatePath("/");

		return { success: true };
	} catch (error) {
		console.error("[DeletePost]", error);
		return { success: false };
	}
};

export const updateDetailsPost = async ({ formData, eventId }: TUpdateDetails): Promise<{ success: boolean, message: string }> => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("You must be logged in to do that");
		}

		if (!checkRateLimit(session.user.id, { maxRequests: 5, windowMs: 30 * 1000 })) {
			return { success: false, message: "Too many requests. Please try again later." };
		}

		if (!/^post-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)) {
			throw new Error("Invalid event ID format");
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId },
			select: { authorId: true }
		});

		if (!event) {
			throw new Error("Event not found");
		}

		if (event.authorId !== session.user.id) {
			throw new Error("You must be the author to update this post");
		}

		const values: FormDataValues = Object.fromEntries(formData.entries());
		values.categories = formData.getAll("categories").filter(Boolean);
		values.has_starpoints = values.has_starpoints === 'true';

		const contactsString = formData.get("contacts");
		values.contacts = [];
		if (typeof contactsString === "string") {
			try {
				const parsed = JSON.parse(contactsString);
				if (Array.isArray(parsed)) {
					values.contacts = parsed;
				}
			} catch (error) {
				console.error("Error parsing contacts:", error);
			}
		}

		const { contacts, ...rest } = detailSchema.parse(values);

		const updateEvent = await prisma.$transaction(async (tx) => {
			const updated = await tx.event.update({
				where: { id: eventId },
				data: {
					...rest,
					categories: rest.categories.map(cat => cat.toLowerCase()),
					contacts: {
						deleteMany: {},
						create: contacts.map((contact) => ({
							name: contact.name.slice(0, 100),
							phone: contact.phone.slice(0, 20),
						})),
					},
				},
			});
			return updated;
		});

		if (!updateEvent) throw new Error("Failed to update post");

		revalidatePath("/discover");
		revalidatePath("/");
		revalidatePath(`/events/${eventId}`);

		return {
			success: true,
			message: "Changes saved successfully",
		};
	} catch (error) {
		console.error("[UpdateDetailsPost]", error);
		return { success: false, message: "Failed to update post" };
	}
};

export const updateDescription = async ({ formData, eventId }: TUpdateDescription): Promise<{ success: boolean, message: string }> => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("You must be logged in to do that");
		}

		if (!checkRateLimit(session.user.id, { maxRequests: 5, windowMs: 30 * 1000 })) {
			return { success: false, message: "Too many requests. Please try again later." };
		}

		if (!/^post-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)) {
			throw new Error("Invalid event ID format");
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId },
			select: { authorId: true }
		});

		if (!event) {
			throw new Error("Event not found");
		}

		if (event.authorId !== session.user.id) {
			throw new Error("You must be the author to update this post");
		}

		const values: FormDataValues = Object.fromEntries(formData.entries());
		const { description } = descSchema.parse(values);

		await prisma.event.update({
			where: { id: eventId },
			data: { description }
		});

		revalidatePath(`/events/${eventId}`);
		revalidatePath("/discover");
		revalidatePath("/");

		return {
			success: true,
			message: "Description updated!"
		};
	} catch (error) {
		console.error("[UpdateDescription]", error);
		return {
			success: false,
			message: "Error updating description"
		};
	}
};

export const getEvents = async () => {
	try {
		return await getCachedEvents();
	} catch (error) {
		console.error("[GetEvents]", error);
		return [];
	}
};