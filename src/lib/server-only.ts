import "server-only";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "./supabase/server";

interface RateLimitOptions {
	maxRequests?: number;
	windowMs?: number;
}

const rateLimitMap = new Map<string, { count: number; timestamp: number }>(); // map is used for memory management
const DEFAULT_WINDOW_MS = 30 * 1000; // 30 seconds
const DEFAULT_MAX_REQUESTS = 20;

export function checkRateLimit(
	userId: string,
	options: RateLimitOptions = {},
): boolean {
	const { maxRequests = DEFAULT_MAX_REQUESTS, windowMs = DEFAULT_WINDOW_MS } =
		options;

	const now = Date.now();
	const userLimit = rateLimitMap.get(userId); // check if previous user request exist

	// first time user
	if (!userLimit) {
		rateLimitMap.set(userId, { count: 1, timestamp: now });
		return true;
	}

	if (now - userLimit.timestamp > windowMs) {
		rateLimitMap.set(userId, { count: 1, timestamp: now });
		return true;
	}

	if (userLimit.count >= maxRequests) {
		return false;
	}

	userLimit.count++;
	return true;
}

const MAX_IMAGE_SIZE = 130 * 1024; // 80KB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const compressImage = async (file: File): Promise<Buffer> => {
	if (!ALLOWED_TYPES.includes(file.type)) {
		throw new Error("Invalid file type. Only JPEG, PNG, and JPG allowed.");
	}

	const buffer = await file.arrayBuffer();
	let compressedImage = await sharp(Buffer.from(buffer))
		.resize({ width: 1080, withoutEnlargement: true })
		.toFormat("jpeg", { quality: 80 })
		.toBuffer();

	// reduce size if it exceeds the limit
	while (compressedImage.byteLength > MAX_IMAGE_SIZE) {
		const qualityReduction = Math.max(
			10,
			Math.floor((compressedImage.byteLength / MAX_IMAGE_SIZE) * 80),
		);
		compressedImage = await sharp(compressedImage)
			.toFormat("jpeg", { quality: 100 - qualityReduction })
			.toBuffer();
	}

	return compressedImage;
};

export const uploadImage = async (
	files: File[],
	encryptedUserId: string,
	assignPostId: string,
): Promise<string[]> => {
	const supabase = createClient();

	return await Promise.all(
		files.map(async (file) => {
			const compressedImage = await compressImage(file);

			const filePath = `post/user-${encryptedUserId}/${assignPostId}/${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
			const { data, error } = await supabase.storage
				.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string)
				.upload(filePath, compressedImage, {
					cacheControl: "3600",
					upsert: false,
					contentType: "image/jpeg",
				});

			if (error) throw new Error("Failed to upload file.");
			return data.path;
		}),
	);
};
