import "server-only"

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
