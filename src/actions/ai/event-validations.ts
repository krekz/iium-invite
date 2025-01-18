"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const validateEventContent = async (
	title: string,
	description: string,
	posterFile: File | string,
) => {
	let imageContent: string;
	if (posterFile instanceof File) {
		const bytes = await posterFile.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const base64Image = buffer.toString("base64");
		imageContent = `data:${posterFile.type};base64,${base64Image}`;
	} else {
		imageContent = posterFile;
	}

	const result = await generateText({
		model: openai("gpt-4o-mini"),
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `
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
								- Event that is borderline (flag this as review).
								- Event that is not clear (flag this as review).
								- Event that is not suitable for the platform (flag this as review).
								- Product selling but it is from club, society, or organization based in IIUM (flag this as review).
								- If you find the content is violated but has IIUM keywords like (Mahalah, Kuliyyah, or other iium related stuff etc), flag this as review.

								Additional Validation:
								- there might be cases where the title or description are passed but the image is not. for example, the event title and desc is about club event but the image poster is selling product or not related. in this case, the event is invalid.
								- my tips is to check for the organizer, if it is a club, society, or organization, it is likely to be valid. If it is a business, it is likely to be invalid.
								- If u unsure or think it is borderline, mark it for review.
								- If the event title or description is in Malay, interpret it accurately to ensure it complies with the rules.

                                the error reason must start with "[Title]", "[Description]", or "[Image]". if the error is in the title, the reason must start with "[Title]". if the error is in the description, the reason must start with "[Description]". if the error is in the image, the reason must start with "[Image]".

								title: ${title}
								description: ${description}
						Response Format:

						"status": valid | invalid | review
						"reason": string (For "invalid" or "review" statuses only. Provide a concise and clear reason in 20 words or less).						Input:

						Title: ${title}
						Description: ${description}
						`,
					},
					{
						type: "image",
						image: imageContent,
						experimental_providerMetadata: {
							openai: { imageDetail: "low" },
						},
					},
				],
			},
		],
	});

	const text = result.steps[0].text;
	const statusMatch = text.match(/"status":\s*"(valid|invalid|review)"/);
	const reasonMatch = text.match(/"reason":\s*"([^"]*)"/);

	if (!statusMatch || !reasonMatch) {
		throw new Error("Unable to parse validation result");
	}

	return {
		status: statusMatch[1] as "valid" | "invalid" | "review",
		type: reasonMatch[1]
			.match(/^\[(.*?)\]/)
			?.at(1)
			?.toLowerCase(),
		reason: reasonMatch[1].replace(/^\[.*?\]\s*/, ""),
	};
};
