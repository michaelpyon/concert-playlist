import Redis from 'ioredis'

// ---------------------------------------------------------------------------
// In-memory fallback (same behaviour as the original cache.js)
// ---------------------------------------------------------------------------
const MEM = globalThis.__concertPlaylistCache || new Map()
if (!globalThis.__concertPlaylistCache) {
  globalThis.__concertPlaylistCache = MEM
}

const memGet = (key) => {
  const entry = MEM.get(key)
  if (!entry) return undefined
  if (entry.expiresAt <= Date.now()) {
    MEM.delete(key)
    return undefined
  }
  return entry.value
}

const memSet = (key, value, ttlSeconds) => {
  MEM.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 })
}

// ---------------------------------------------------------------------------
// Redis client (lazy singleton)
// ---------------------------------------------------------------------------
let redis = null
let redisAvailable = false

function getRedis() {
  if (redis) return redis

  const url = process.env.REDIS_URL
  if (!url) return null

  redis = new Redis(url, {
    maxRetriesPerRequest: 1,
    connectTimeout: 5000,
    lazyConnect: true,
  })

  redis.on('error', (err) => {
    console.error('[redis-cache] Redis error, falling back to in-memory:', err.message)
    redisAvailable = false
  })

  redis.on('connect', () => {
    redisAvailable = true
  })

  // Kick off the connection without blocking module load
  redis.connect().catch((err) => {
    console.error('[redis-cache] Failed to connect to Redis:', err.message)
    redisAvailable = false
  })

  return redis
}

// Initialise on first import
getRedis()

// ---------------------------------------------------------------------------
// Public API – matches the shape expected by the route handlers
// ---------------------------------------------------------------------------

/**
 * Retrieve a cached value by key.
 * Returns the parsed value or undefined if not cached / expired.
 */
export async function get(key) {
  const client = getRedis()

  if (client && redisAvailable) {
    try {
      const raw = await client.get(key)
      if (raw !== null) {
        return JSON.parse(raw)
      }
      return undefined
    } catch (err) {
      console.error('[redis-cache] get() failed, falling back to in-memory:', err.message)
      redisAvailable = false
    }
  }

  // Fallback
  return memGet(key)
}

/**
 * Store a value under key with the given TTL (in seconds).
 */
export async function set(key, value, ttlSeconds) {
  const client = getRedis()

  if (client && redisAvailable) {
    try {
      await client.setex(key, ttlSeconds, JSON.stringify(value))
      return
    } catch (err) {
      console.error('[redis-cache] set() failed, falling back to in-memory:', err.message)
      redisAvailable = false
    }
  }

  // Fallback
  memSet(key, value, ttlSeconds)
}

/**
 * Convenience wrapper: return cached value if present, otherwise call loader,
 * cache the result and return it.  TTL is in **milliseconds** for backwards-
 * compatibility with the existing callsites (withCache used ms).
 */
export async function withCache(key, ttlMs, loader) {
  const ttlSeconds = Math.ceil(ttlMs / 1000)

  const cached = await get(key)
  if (cached !== undefined) {
    return cached
  }

  const value = await loader()
  await set(key, value, ttlSeconds)
  return value
}
