"use server";

import { fixedCategories } from "@/lib/constant";
import prisma from "@/lib/prisma";
import { createOpenAI } from "@ai-sdk/openai";
import { cosineSimilarity, embedMany } from "ai";
import { unstable_cache } from "next/cache";

type RecommendationResult = {
	id: string;
	poster_url: string[];
};

const contentLibrary = fixedCategories.flatMap((category) =>
	category.subsets.map((subset) => subset.toLowerCase()),
);

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const eventRecommendations = unstable_cache(
	async (
		currentEventId: string,
		categories: string[],
	): Promise<RecommendationResult[]> => {
		try {
			const [allEvents, embeddingResult] = await Promise.all([
				prisma.event.findMany({
					where: {
						NOT: { id: currentEventId },
						isActive: true,
					},
					select: { id: true, poster_url: true, categories: true },
					take: 20,
					orderBy: { createdAt: "desc" },
				}),
				embedMany({
					model: openai.embedding("text-embedding-3-small"),
					values: [...categories, ...contentLibrary],
				}).catch((error) => {
					console.error("Embedding error:", error);
					throw new Error("Failed to generate embeddings");
				}),
			]);

			const [userEmbedding, ...contentEmbeddings] = embeddingResult.embeddings;

			const similarityScores = new Float32Array(contentLibrary.length);
			for (let i = 0; i < contentLibrary.length; i++) {
				similarityScores[i] = cosineSimilarity(
					userEmbedding,
					contentEmbeddings[i],
				);
			}

			const indices = new Uint16Array(contentLibrary.length);
			for (let i = 0; i < indices.length; i++) indices[i] = i;
			indices.sort((a, b) => similarityScores[b] - similarityScores[a]);

			const topCategories = new Set(
				Array.from(indices)
					.slice(0, 20)
					.map((i) => contentLibrary[i]),
			);
			const matchedEvents = allEvents
				.filter((event) =>
					event.categories.some((category) =>
						topCategories.has(category.toLowerCase()),
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
		} catch (error) {
			console.error("Recommendation error:", error);
			throw new Error("Failed to generate recommendations");
		}
	},
	["event-recommendations"],
	{
		revalidate: 300,
		tags: ["events"],
	},
);
