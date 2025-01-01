"use server";

import { fixedCategories } from "@/lib/constant";
import prisma from "@/lib/prisma";
import { createOpenAI } from "@ai-sdk/openai";
import { cosineSimilarity, embedMany } from "ai";
import { unstable_cache } from "next/cache";

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const contentLibrary = fixedCategories.flatMap((category) =>
	category.subsets.map((subset) => subset),
);

export const eventRecommendations = unstable_cache(
	async (
		currentEventId: string,
		categories: string[],
	): Promise<{ id: string; poster_url: string[] }[]> => {
		const allEvents = await prisma.event.findMany({
			where: { NOT: { id: currentEventId }, isActive: true },
			select: { id: true, poster_url: true, categories: true },
			take: 20,
		});

		const { embeddings } = await embedMany({
			model: openai.embedding("text-embedding-3-small"),
			values: [...categories, ...contentLibrary],
		});

		const [userEmbedding, ...contentEmbeddings] = embeddings;

		const similarityScore = contentLibrary.map((content, index) => ({
			content,
			similarity: cosineSimilarity(userEmbedding, contentEmbeddings[index]),
		}));

		const topCategories = similarityScore
			.sort((a, b) => b.similarity - a.similarity)
			.slice(0, 20)
			.map((event) => event.content.toLowerCase());

		const matchedEvents = allEvents
			.filter((event) =>
				event.categories.some((category) =>
					topCategories.includes(category.toLowerCase()),
				),
			)
			.slice(0, 10);

		if (matchedEvents.length < 10) {
			const remainingCount = 10 - matchedEvents.length;
			const matchedIds = new Set(matchedEvents.map((event) => event.id));

			const remainingEvents = allEvents
				.filter((event) => !matchedIds.has(event.id))
				.slice(0, remainingCount);

			return [...matchedEvents, ...remainingEvents];
		}

		return matchedEvents;
	},
	["event-recommendations"],
	{
		revalidate: 300, // Cache for 5 minutes
		tags: ["events"],
	},
);
