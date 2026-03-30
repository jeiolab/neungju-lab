import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redisClient: Redis | null | undefined

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  if (!url || !token) {
    redisClient = null
    return null
  }
  redisClient = new Redis({ url, token })
  return redisClient
}

function envInt(name: string, fallback: number): number {
  const v = process.env[name]
  if (!v) return fallback
  const n = parseInt(v, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function windowSeconds(): number {
  const ms = envInt('API_RATE_LIMIT_WINDOW_MS', 60_000)
  return Math.max(1, Math.floor(ms / 1000))
}

function maxRequests(): number {
  return envInt('API_RATE_LIMIT_MAX', 120)
}

let llmLimit: Ratelimit | undefined
let geminiLimit: Ratelimit | undefined

function getLlmRatelimit(redis: Redis): Ratelimit {
  if (!llmLimit) {
    llmLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests(), `${windowSeconds()} s`),
      prefix: 'jeiolab:rl:llm',
      analytics: false,
    })
  }
  return llmLimit
}

function getGeminiRatelimit(redis: Redis): Ratelimit {
  if (!geminiLimit) {
    geminiLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests(), `${windowSeconds()} s`),
      prefix: 'jeiolab:rl:gemini',
      analytics: false,
    })
  }
  return geminiLimit
}

export type UpstashRateOutcome =
  | { used: false }
  | { used: true; ok: true }
  | { used: true; ok: false; retryAfterSec: number }

/**
 * UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN 가 있으면 Upstash로 제한,
 * 없으면 { used: false } 로 메모리 리밋으로 넘깁니다.
 */
export async function checkUpstashRateLimit(
  family: 'llm' | 'gemini',
  ip: string
): Promise<UpstashRateOutcome> {
  const redis = getRedis()
  if (!redis) return { used: false }

  const limiter = family === 'llm' ? getLlmRatelimit(redis) : getGeminiRatelimit(redis)
  const { success, reset } = await limiter.limit(ip)

  if (success) return { used: true, ok: true }

  const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
  return { used: true, ok: false, retryAfterSec }
}
