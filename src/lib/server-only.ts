import "server-only"
import sharp from 'sharp'

interface RateLimitOptions {
    maxRequests?: number
    windowMs?: number
}

const rateLimitMap = new Map<string, { count: number, timestamp: number }>() // map is used for memory management
const DEFAULT_WINDOW_MS = 60 * 1000 // 1 minute
const DEFAULT_MAX_REQUESTS = 10

export function checkRateLimit(userId: string, options: RateLimitOptions = {}): boolean {
    const {
        maxRequests = DEFAULT_MAX_REQUESTS,
        windowMs = DEFAULT_WINDOW_MS
    } = options

    const now = Date.now()
    const userLimit = rateLimitMap.get(userId) // check if previous user request exist

    // first time user
    if (!userLimit) {
        rateLimitMap.set(userId, { count: 1, timestamp: now })
        return true
    }

    if (now - userLimit.timestamp > windowMs) {
        rateLimitMap.set(userId, { count: 1, timestamp: now })
        return true
    }

    if (userLimit.count >= maxRequests) {
        return false
    }

    userLimit.count++
    return true
}


const MAX_IMAGE_SIZE = 200 * 1024; // 200KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export const compressImage = async (file: File): Promise<Buffer> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, and JPG allowed.");
    }

    const buffer = await file.arrayBuffer();
    let compressedImage = await sharp(Buffer.from(buffer))
        .resize({ width: 1080, withoutEnlargement: true }) // Resize to reasonable dimensions
        .toFormat("jpeg", { quality: 80 }) // Compress with quality
        .toBuffer();

    // Further reduce size if it exceeds the limit
    while (compressedImage.byteLength > MAX_IMAGE_SIZE) {
        const qualityReduction = Math.max(10, Math.floor((compressedImage.byteLength / MAX_IMAGE_SIZE) * 80));
        compressedImage = await sharp(compressedImage)
            .toFormat("jpeg", { quality: 100 - qualityReduction })
            .toBuffer();
    }

    return compressedImage;
};