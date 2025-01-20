"use server";

import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import OpenAI from "openai";

const client = new OpenAI({
	baseURL: process.env.OPENAI_BASE_URL,
	apiKey: process.env.OPENAI_API_KEY,
});

const groq = createGroq({
	apiKey: process.env.GROQ_API_KEY,
});
const model = groq("llama3-70b-8192");

export const validateEventContent = async (
	title: string,
	description: string,
	posterFile: File | string,
): Promise<{
	status: "valid" | "invalid" | "review" | "error";
	type: "image" | "title" | "description" | "none";
	reason: string;
}> => {
	try {
		let imageContent: string;
		if (posterFile instanceof File) {
			const bytes = await posterFile.arrayBuffer();
			const buffer = Buffer.from(bytes);
			const base64Image = buffer.toString("base64");
			imageContent = `data:${posterFile.type};base64,${base64Image}`;
		} else {
			imageContent = posterFile;
		}

		const result = await client.chat.completions.create({
			model: "moondream-2B",
			messages: [
				{
					role: "user",
					content: [
						{
							type: "text",
							text: "Describe the poster, title, and description of an event. Describe only the important things only. Highlight what do u think is important from the image that you understand. maximum 80 words or below is better ",
						},
						{
							type: "image_url",
							image_url: {
								url: imageContent,
								detail: "low",
							},
						},
					],
				},
			],
		});
		const imageDescription = result.choices[0].message.content?.toString();

		/// full text validate here
		const { text } = await generateText({
			model,
			messages: [
				{
					role: "system",
					content: `
						You are a content moderator for university events platform. Evaluate submissions based on these rules:

									ALLOWED:
									- Recruitment events for clubs, societies, or organizations. it okay if not explicitly stated.
									- All university based events, workshops, sports, cultural, religious, entertainment, charity, social, educational, recreational, community, blood donation, health, and wellness events, martial arts, IIUM based events, and events with participation fees or ticket prices.
									- Third party outside of university events that are beneficial to students.
									- non-univeristy events that are beneficial to students.
									- clubs, societies, or organizations events.

									NOT ALLOWED (immediate rejection):
									- Personal direct product sales
									- Business advertisements or marketing content (personal or company)
									- Personal events like birthdays or weddings
									- Product launches focused on selling
									- Survey
									- Assignment Purpose
									- Job vacancy
									- Posting just for fun

									ADMIN REVIEW (mark as review):
									- Event which require fees/payment (flag this as review).
									- Donation content
									- Event that is borderline (flag this as review).
									- Event that is not clear (flag this as review).
									- Event that is not suitable for the platform (flag this as review).
									- Product selling but it is from club, society, or organization based in IIUM (flag this as review).
									- If you find the content is violated but has IIUM keywords like (Mahalah, Kuliyyah, or other iium related stuff etc), flag this as review.

									Additional Validation:
									- there might be cases where the title or description are passed but the image is not. for example, the event title and desc is about club event but the image poster is selling product or not related. in this case, the event is invalid.
									- ensure title, desc and image are related and consistent. otherwise pls reject
									- my tips is to check for the organizer, if it is a club, society, or organization, it is likely to be valid. If it is a business, it is likely to be invalid.
									- If u unsure or think it is borderline, mark it for review.
									- If the event title or description is in Malay, interpret it accurately to ensure it complies with the rules.

									the error reason must start with "[Title]", "[Description]", or "[Image]". if the error is in the title, the reason must start with "[Title]". if the error is in the description, the reason must start with "[Description]". if the error is in the image, the reason must start with "[Image]".

									the title is  ${title}
									and the desc is: ${description}
                                    and the image description is about : ${imageDescription}
							Response Format:
                            no need to be in json format, just all string only
                            only reply with these 3 lines :
							status: valid | invalid | review
                            type: image | title | description | none (if valid only)
							reason: string ( Provide a concise and clear reason in 20 words or less including for "valid" content no matter what).				
							`,
				},
			],
		});

		const lines = text.split("\n");
		const status = lines[0].split(": ")[1].trim();
		const type = lines[1].split(": ")[1].trim();
		const reason = lines[2].split(": ")[1].trim();

		if (!status || !reason) {
			throw new Error("Unable to parse validation result");
		}

		return {
			status: status as "valid" | "invalid" | "review" | "error",
			type: type as "image" | "title" | "description" | "none",
			reason,
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			status: "error",
			type: "none",
			reason: String(error),
		};
	}
};
