"use server";
import crypto from "node:crypto";
import { validateEventContent } from "@/actions/ai/event-validations";
import { auth } from "@/actions/authentication/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit, uploadImage } from "@/lib/server-only";
import { validateEventId } from "@/lib/utils";
import { descSchema, detailSchema, postSchema } from "@/lib/validations/post";
import { nanoid } from "nanoid";
import { revalidateTag } from "next/cache";

type Input = {
	formData: FormData;
};

type TUpdateDescription = {
	formData: FormData;
	eventId: string;
};

type TUpdateDetails = {
	formData: FormData;
	eventId: string;
};

type FormDataValues = Record<
	string,
	FormDataEntryValue | FormDataEntryValue[] | boolean
>;

export const createPost = async (
	input: Input,
): Promise<{ success: boolean; message: string; eventId: string }> => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			console.error("[CreatePost] Unauthorized: No user session");
			return {
				success: false,
				message: "You must be logged in to do that",
				eventId: "",
			};
		}

		if (!checkRateLimit(session.user.id, { maxRequests: 2 })) {
			console.error(
				"[CreatePost] Rate limit exceeded for user:",
				session.user.id,
			);
			return {
				success: false,
				message: "Too many requests. Please try again later.",
				eventId: "",
			};
		}

		const { formData } = input;
		const values: FormDataValues = Object.fromEntries(formData.entries());

		const [poster_url, categories] = await Promise.all([
			formData.getAll("poster_url").filter(Boolean),
			formData.getAll("categories").filter(Boolean),
		]);
		values.poster_url = poster_url;
		values.categories = categories;

		let contacts: any[] = [];
		const contactsString = formData.get("contacts");
		if (typeof contactsString === "string") {
			try {
				const parsed = JSON.parse(contactsString);
				contacts = Array.isArray(parsed) ? parsed : [];
			} catch (error) {
				console.error("[CreatePost] Error parsing contacts:", error);
			}
		}
		values.contacts = contacts;

		// conver to boolean values
		values.has_starpoints = values.has_starpoints === "true";
		values.isRecruiting = values.isRecruiting === "true";

		const parsedData = postSchema.parse(values);
		const {
			title,
			campus,
			categories: validatedCategories,
			date,
			description,
			fee,
			has_starpoints,
			location,
			organizer,
			poster_url: validatedPosterUrl,
			registration_link,
			isRecruiting,
		} = parsedData;

		const assignPostId = nanoid();
		const encryptedUserId = crypto
			.createHash("sha256")
			.update(session.user.id)
			.digest("hex");

		const validateEvent = await validateEventContent(
			title,
			description,
			validatedPosterUrl[0],
		);

		if (validateEvent.status === "invalid") {
			console.error("[CreatePost] Event rejected by AI:", validateEvent.reason);
			return {
				success: false,
				message:
					"Your content is violating our guidelines. If you think this is a mistake, please contact us.",
				eventId: "",
			};
		}

		const uploadedFiles = await uploadImage(
			validatedPosterUrl,
			encryptedUserId,
			assignPostId,
		);

		const newEvent = await prisma.$transaction(async (tx) => {
			const event = await tx.event.create({
				data: {
					id: assignPostId,
					authorId: session.user.id,
					title,
					campus,
					categories: validatedCategories.map((cat) => cat.toLowerCase()),
					date: new Date(date.setUTCHours(16, 0, 0, 0)), // 16 in UTC is midnight in Malaysia (12am)
					description,
					fee,
					has_starpoints,
					location,
					organizer,
					poster_url: uploadedFiles,
					registration_link,
					isRecruiting,
					contacts: {
						create: contacts.map((contact) => ({
							name: contact.name.slice(0, 100),
							phone: contact.phone.slice(0, 20),
						})),
					},
				},
			});

			if (validateEvent.status === "review") {
				await tx.eventReport.create({
					data: {
						eventId: event.id,
						reason: validateEvent.reason,
						reportedBy: "AI",
						status: "pending",
						type: validateEvent.reason.includes("Title")
							? "title"
							: validateEvent.reason.includes("Description")
								? "description"
								: "image",
					},
				});
			}

			return event;
		});

		revalidateTag("events");
		revalidateTag("event-reports");

		return {
			success: true,
			message: "Post created successfully",
			eventId: newEvent.id,
		};
	} catch (error) {
		console.error("[CreatePost]", error);
		return { success: false, message: "Failed to create post", eventId: "" };
	}
};

export const updateDetailsPost = async ({
	formData,
	eventId,
}: TUpdateDetails): Promise<{ success: boolean; message: string }> => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			console.error("[UpdateDetailsPost] Unauthorized: No user session");
			return { success: false, message: "You must be logged in to do that" };
		}

		if (
			!checkRateLimit(session.user.id, {
				maxRequests: 5,
				windowMs: 30 * 1000,
			})
		) {
			console.error(
				"[UpdateDetailsPost] Rate limit exceeded for user:",
				session.user.id,
			);
			return {
				success: false,
				message: "Too many requests. Please try again later.",
			};
		}

		if (!validateEventId(eventId)) {
			console.error("[UpdateDetailsPost] Invalid event ID format:", eventId);
			return { success: false, message: "Invalid event ID format" };
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId, isActive: true },
			select: { authorId: true },
		});

		if (!event) {
			console.error("[UpdateDetailsPost] Event not found or expired:", eventId);
			return { success: false, message: "Event not found or expired" };
		}

		if (event.authorId !== session.user.id) {
			console.error(
				"[UpdateDetailsPost] Unauthorized: User is not the author",
				{
					userId: session.user.id,
					authorId: event.authorId,
				},
			);
			return {
				success: false,
				message: "You must be the author to update this post",
			};
		}

		const values: FormDataValues = Object.fromEntries(formData.entries());
		values.categories = formData.getAll("categories").filter(Boolean);
		values.has_starpoints = values.has_starpoints === "true";
		values.isRecruiting = values.isRecruiting === "true"; //convet string "true" into array

		const contactsString = formData.get("contacts");
		values.contacts = [];
		if (typeof contactsString === "string") {
			try {
				const parsed = JSON.parse(contactsString);
				if (Array.isArray(parsed)) {
					values.contacts = parsed;
				}
			} catch (error) {
				console.error("[UpdateDetailsPost] Error parsing contacts:", error);
			}
		}

		const { contacts, ...rest } = detailSchema.parse(values);

		const updateEvent = await prisma.$transaction(async (tx) => {
			const updated = await tx.event.update({
				where: { id: eventId },
				data: {
					...rest,
					categories: rest.categories.map((cat) => cat.toLowerCase()),
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

		if (!updateEvent) {
			console.error("[UpdateDetailsPost] Failed to update event:", eventId);
			return { success: false, message: "Failed to update post" };
		}

		revalidateTag("events");

		return {
			success: true,
			message: "Changes saved successfully",
		};
	} catch (error) {
		console.error("[UpdateDetailsPost]", error);
		return { success: false, message: "Failed to update post" };
	}
};

export const updateDescription = async ({
	formData,
	eventId,
}: TUpdateDescription): Promise<{ success: boolean; message: string }> => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			console.error("[UpdateDescription] Unauthorized: No user session");
			return { success: false, message: "You must be logged in to do that" };
		}

		if (
			!checkRateLimit(session.user.id, {
				maxRequests: 5,
				windowMs: 30 * 1000,
			})
		) {
			console.error(
				"[UpdateDescription] Rate limit exceeded for user:",
				session.user.id,
			);
			return {
				success: false,
				message: "Too many requests. Please try again later.",
			};
		}

		if (!validateEventId(eventId)) {
			console.error("[UpdateDescription] Invalid event ID format:", eventId);
			return { success: false, message: "Invalid event ID format" };
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId, isActive: true },
			select: {
				authorId: true,
			},
		});

		if (!event) {
			console.error("[UpdateDescription] Event not found or expired:", eventId);
			return { success: false, message: "Event not found or expired" };
		}

		if (event.authorId !== session.user.id) {
			console.error(
				"[UpdateDescription] Unauthorized: User is not the author",
				{
					userId: session.user.id,
					authorId: event.authorId,
				},
			);
			return {
				success: false,
				message: "You must be the author to update this post",
			};
		}

		const values: FormDataValues = Object.fromEntries(formData.entries());
		const { description } = descSchema.parse(values);

		await prisma.event.update({
			where: { id: eventId },
			data: { description },
		});

		revalidateTag("events");

		return {
			success: true,
			message: "Description updated!",
		};
	} catch (error) {
		console.error("[UpdateDescription]", error);
		return {
			success: false,
			message: "Error updating description",
		};
	}
};
