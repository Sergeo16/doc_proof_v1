/**
 * DOC PROOF - Redis Client
 * Used for: caching, rate limiting, session storage
 */

import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

declare global {
  var redis: Redis | undefined;
}

export const redis =
  global.redis ||
  new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

redis.on("error", () => {}); // Suppress unhandled error during build

if (process.env.NODE_ENV !== "production") global.redis = redis;

export const RATE_LIMIT_PREFIX = "rl:";
export const CACHE_PREFIX = "cache:";
export const SESSION_PREFIX = "session:";

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  const redisKey = `${RATE_LIMIT_PREFIX}${key}`;
  const current = await redis.incr(redisKey);
  if (current === 1) await redis.expire(redisKey, windowSeconds);
  const ttl = await redis.ttl(redisKey);
  if (ttl === -1) await redis.expire(redisKey, windowSeconds);
  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
  };
}
