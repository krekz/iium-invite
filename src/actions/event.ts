"use server";

import { createClient } from "@/lib/supabase/server";
import { descSchema, postSchema } from "@/lib/validations/post";
import { toZonedTime } from 'date-fns-tz'
import prisma from "@/lib/prisma";

import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

type Input = {
	formData: FormData;
	userId: number;
};

type FormDataValues = Record<string, FormDataEntryValue | FormDataEntryValue[] | boolean>;


export const CreatePost = async (input: Input): Promise<{ success: boolean; message: string; id: string }> => {
	const { formData, userId } = input;
	if (!userId) throw new Error("You must be logged in to do that");

	const values: FormDataValues = Object.fromEntries(formData.entries());
	["poster_url", "categories"].forEach((key) => {
		if (formData.getAll(key).length >= 1) {
			values[key] = formData.getAll(key);
		}
	})

	values.has_starpoints = values.has_starpoints === 'true'; // convert string to boolean


	// Or you can use this instead of the above forEach
	// values.poster_url = formData.getAll("poster_url");
	// values.categories = formData.getAll("categories");

	try {
		const supabase = createClient();
		const { title, campus, categories, date, description, fee, has_starpoints, location, organizer, poster_url, registration_link } = postSchema.parse(values)
		const uploadedDate = new Date();
		const malaysiaTime = toZonedTime(uploadedDate, 'Asia/Kuala_Lumpur');
		// const formattedDate = format(malaysiaTime, 'dd-MMM_hh:mma', { timeZone: 'Asia/Kuala_Lumpur' });
		const assignPostId = `post-${uuidv4()}`;


		const uploadedFiles = await Promise.all(poster_url.map(async (file) => {
			const filePath = `${assignPostId}/${uuidv4()}-${file.name}`;
			const { data, error } = await supabase.storage
				.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
				.upload(filePath, file);

			if (error) throw error;
			return data.path;
		}));

		// Store the array of uploaded file paths
		const posterUrls = uploadedFiles;
		const newEvent = await prisma.event.create({
			data: {
				id: assignPostId,
				title,
				campus,
				categories,
				date,
				description,
				fee,
				has_starpoints,
				location,
				organizer,
				poster_url: posterUrls,
				registration_link,
				// TODO:  authorId: userId,
			}
		});

		return {
			success: true,
			message: "Post created successfully",
			id: newEvent.id
		};
	} catch (error) {
		console.log(error);
		return { success: false, message: "Failed to create post", id: "" };
	}

};

type TDelete = {
	eventId: string,
	userId: number,
}

export const deletePost = async ({ eventId, userId = 123 }: TDelete): Promise<{ success: boolean }> => {
	// NOTE: delete actions need to re-modify since it doesnt have authorize check
	try {
		if (!userId) throw new Error("You must be logged in to do that");
		const supabase = createClient();
		const getimagePath = await prisma.event.delete({
			where: {
				id: eventId,
			},
			select: {
				poster_url: true,
			}
		})

		// TODO: Add a check if the user is the author of the post

		const { error: fileError } = await supabase.storage
			.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
			.remove(getimagePath.poster_url.map((url) => url));

		if (fileError) throw fileError;

		revalidatePath("/discover");
		revalidatePath("/");

		return { success: true };
	} catch (error) {
		console.log(error);
		return { success: false };
	}
};

type TUpdateDetails = {
	formData: FormData,
	userId: string,
	eventId: string,
}
export const updateDetailsPost = async ({ formData, userId, eventId }: TUpdateDetails): Promise<{ success: boolean, message: string }> => {

	const values: FormDataValues = Object.fromEntries(formData.entries());
	["categories"].forEach((key) => {
		if (formData.getAll(key).length >= 1) {
			values[key] = formData.getAll(key);
		}
	})

	try {
		const updateEvent = await prisma.event.update({
			where: {
				id: eventId,
			},
			data: {
				...values,
			}
		})

		if (!updateEvent) throw new Error("Failed to update post");
		revalidatePath("/discover");
		revalidatePath(`/events/${eventId}`);
		return {
			success: true,
			message: "Changes saved successfully",
		};
	} catch (error) {
		console.log(error)
		return { success: false, message: "Failed to update post" };
	}
}

type TUpdateDescription = {
	formData: FormData,
	userId: string,
	eventId: string
}

export const updateDescription = async ({ formData, userId, eventId }: TUpdateDescription): Promise<{ success: boolean, message: string }> => {
	try {
		// todo: add authorization check

		const values: FormDataValues = Object.fromEntries(formData.entries())
		const { description } = descSchema.parse(values)
		await prisma.event.update({
			where: {
				id: eventId,
			},
			data: {
				description
			}
		})
		revalidatePath(`/events/${eventId}`);
		return {
			success: true,
			message: "Description updated!"
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: "Error updating description"
		}
	}
}