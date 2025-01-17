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
						text: `You are a content moderator for university events platform. Evaluate submissions based on these rules:

                                ALLOWED:
                                - Recruitment events for clubs, societies, or organizations. it okay if not explicitly stated.
                                - All university based events, workshops, sports, cultural, religious, entertainment, charity, social, educational, recreational, community, blood donation, health, and wellness events, martial arts, IIUM based events, and events with participation fees or ticket prices.
                                - Third party outside of university events that are beneficial to students.
                                - non-univeristy events that are beneficial to students.

                                NOT ALLOWED:
                                - Direct product sales or service promotions
                                - Business advertisements or marketing content
                                - Personal events like birthdays or weddings
                                - Product launches focused on selling
                                - Regular business promotions disguised as events
                                - Survey
                                - Assignment Purpose
                                - Job vacancy
                                - Posting just for fun

								Additional Validation:

								If the event title or description is in Malay, interpret it accurately to ensure it complies with the rules.

                                the error reason must start with "[Title]", "[Description]", or "[Image]". if the error is in the title, the reason must start with "[Title]". if the error is in the description, the reason must start with "[Description]". if the error is in the image, the reason must start with "[Image]".

								title: ${title}
								description: ${description}

								response based on this format. no need to be in json:
											"isValid": boolean,
											"reason": string (explanation only for invalid, make sure it is clear reason and helpful as admin gonna reevaluate it later (max 20words))`,
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
	const isValidMatch = text.match(/"isValid":\s*(true|false)/);
	const reasonMatch = text.match(/"reason":\s*"([^"]*)"/);

	return {
		success: isValidMatch ? isValidMatch[1] === "true" : false,
		reason: reasonMatch ? reasonMatch[1] : "Unable to parse validation reason",
	};
};
