import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : undefined

// Per rules: enforce per-user + per-IP
export const userLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 m"), analytics: true, prefix: "rl:user" })
  : undefined

export const ipLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, "1 m"), analytics: true, prefix: "rl:ip" })
  : undefined

export async function enforceRateLimits(params: { userId?: string; ip?: string }) {
  const now = Date.now()
  if (userLimiter && params.userId) {
    const r = await userLimiter.limit(params.userId)
    if (!r.success) {
      const retryAfter = Math.ceil((r.reset - now) / 1000)
      return { ok: false as const, scope: "user", retryAfter }
    }
  }
  if (ipLimiter && params.ip) {
    const r = await ipLimiter.limit(params.ip)
    if (!r.success) {
      const retryAfter = Math.ceil((r.reset - now) / 1000)
      return { ok: false as const, scope: "ip", retryAfter }
    }
  }
  return { ok: true as const }
}

