interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const PREFIX = "lb_cache_"

function getStorage(): Storage | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage
  }
  if (typeof globalThis !== "undefined") {
    const g = globalThis as unknown as { localStorage?: Storage }
    if (g.localStorage) return g.localStorage
  }
  return null
}

export function getCached<T>(key: string): T | null {
  try {
    const storage = getStorage()
    if (!storage) return null
    const raw = storage.getItem(PREFIX + key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() > entry.expiresAt) {
      storage.removeItem(PREFIX + key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  try {
    const storage = getStorage()
    if (!storage) return
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + ttlMs,
    }
    storage.setItem(PREFIX + key, JSON.stringify(entry))
  } catch {
    // Ignore storage quota or disabled localStorage errors
  }
}
