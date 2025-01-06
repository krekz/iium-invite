import * as z from "zod";

export const descSchema = z.object({
	description: z.string().min(3, "Description can't be empty"),
});

export const detailSchema = z.object({
	title: z
		.string()
		.min(3, "Title can't be empty")
		.max(35, "Characters too long "),
	location: z
		.string()
		.min(3, "Location is required")
		.max(15, "Characters too long"),
	organizer: z
		.string()
		.min(3, "Organizer required")
		.max(20, "Characters too long"),
	campus: z
		.string()
		.refine(
			(value) => ["Gombak", "Kuantan", "Gambang", "Pagoh"].includes(value),
			{
				message: "Please select a valid campus",
			},
		),
	fee: z.string().regex(/^\d+(\.\d{1,2})?$/),
	categories: z.array(z.string()).min(1, "At least one category is required"),
	contacts: z
		.array(
			z.object({
				name: z.string().min(1, "Name is required"),
				phone: z.string().refine((phone) => /^\d+$/.test(phone), {
					message: "Phone must contain only numbers",
				}),
			}),
		)
		.min(1, "At least one contact is required")
		.max(2, "Maximum of two contacts allowed"),
	registration_link: z.union([z.string().url(), z.literal("")]).optional(),
	has_starpoints: z.boolean(),
	isRecruiting: z.boolean(),
});

export const postSchema = z
	.object({
		poster_url: z
			.array(z.instanceof(File))
			.refine((files) => files.length > 0 && files.length <= 3, {
				message: "Please upload 1-3 images",
			})
			.refine(
				(files) =>
					files.every(
						(file) =>
							file.size <= 1024 * 1024 * 0.5 &&
							["image/png", "image/jpeg", "image/jpg", "video/mp4"].includes(
								file.type,
							),
					),
				{
					message:
						"Invalid file format or size, each file should be less than 500KB",
				},
			),
		date: z.coerce.date().refine((date) => date > new Date(), {
			message: "Invalid date",
		}),
	})
	.and(detailSchema)
	.and(descSchema);

export const emailSchema = z.object({
	email: z
		.string()
		.email()
		.refine((email) => email.endsWith("@live.iium.edu.my"), {
			message: "Only @live.iium email addresses are allowed",
		}),
});
