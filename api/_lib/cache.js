const CACHE = globalThis.__concertPlaylistCache || new Map()

if (!globalThis.__concertPlaylistCache) {
  globalThis.__concertPlaylistCache = CACHE
}

export async function withCache(key, ttlMs, loader) {
  const now = Date.now()
  const cached = CACHE.get(key)

  if (cached && cached.expiresAt > now) {
    return cached.value
  }

  const value = await loader()
  CACHE.set(key, {
    value,
    expiresAt: now + ttlMs,
  })
  return value
}

