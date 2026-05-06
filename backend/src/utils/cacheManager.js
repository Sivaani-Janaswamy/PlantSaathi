// Simple in-memory cache with TTL (Time-To-Live) support

class CacheEntry {
  constructor(data, ttlSeconds) {
    this.data = data;
    this.expiresAt = Date.now() + (ttlSeconds * 1000);
  }

  isExpired() {
    return Date.now() > this.expiresAt;
  }
}

class CacheManager {
  constructor() {
    this.store = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000); // 5 min
  }

  set(key, data, ttlSeconds = 3600) {
    this.store.set(key, new CacheEntry(data, ttlSeconds));
    this.stats.sets++;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (entry.isExpired()) {
      this.store.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  has(key) {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (entry.isExpired()) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    const deleted = this.store.delete(key);
    if (deleted) this.stats.deletes++;
    return deleted;
  }

  clear() {
    this.store.clear();
    this.stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };
  }

  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.store.entries()) {
      if (entry.isExpired()) {
        this.store.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`[Cache] Cleaned up ${cleaned} expired entries`);
    }
  }

  getStats() {
    return {
      ...this.stats,
      hitRate: this.stats.hits + this.stats.misses > 0
        ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) + '%'
        : 'N/A',
      size: this.store.size
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// Middleware to cache GET responses
function cacheMiddleware(key, ttlSeconds = 3600) {
  return (req, res, next) => {
    const cached = cacheManager.get(key);
    if (cached) {
      return res.set('X-Cache', 'HIT').json(cached);
    }

    // Intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cacheManager.set(key, data, ttlSeconds);
      return originalJson(data).set('X-Cache', 'MISS');
    };

    next();
  };
}

// Middleware to generate cache key from request
function cacheKeyMiddleware(generator) {
  return (req, res, next) => {
    req.cacheKey = generator(req);
    next();
  };
}

// Global cache instance
const cacheManager = new CacheManager();

export { cacheManager, cacheMiddleware, cacheKeyMiddleware, CacheManager };
