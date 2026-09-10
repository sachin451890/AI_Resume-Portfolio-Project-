const Redis = require('ioredis');
const config = require('./index');

let redisClient = null;
const memoryStore = new Map();

const redisUrl = process.env.REDIS_URL || config.redisUrl;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || null;

try {
  if (redisUrl) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 2) return null; // Stop retrying and fallback to in-memory store
        return Math.min(times * 100, 1000);
      }
    });
  } else {
    redisClient = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 2) return null;
        return Math.min(times * 100, 1000);
      }
    });
  }

  redisClient.on('connect', () => {
    console.log(`[Redis]: Successfully connected to Redis instance at ${redisHost}:${redisPort}`);
  });

  redisClient.on('error', (err) => {
    // Silent fallback to memory cache if local Redis server is not active
  });
} catch (err) {
  console.warn('[Redis Warning]: Could not initialize Redis client. Falling back to Memory Store.');
}

/**
 * Unified Redis Service API with graceful Fallback Memory Cache
 */
class UnifiedRedisCache {
  async get(key) {
    try {
      if (redisClient && redisClient.status === 'ready') {
        const val = await redisClient.get(key);
        return val ? JSON.parse(val) : null;
      }
    } catch (e) {}

    // Fallback in-memory cache lookup
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, ttlSeconds = 3600) {
    try {
      if (redisClient && redisClient.status === 'ready') {
        await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return true;
      }
    } catch (e) {}

    // Fallback in-memory store
    memoryStore.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
    });
    return true;
  }

  async del(key) {
    try {
      if (redisClient && redisClient.status === 'ready') {
        await redisClient.del(key);
      }
    } catch (e) {}
    memoryStore.delete(key);
    return true;
  }

  async flushAll() {
    try {
      if (redisClient && redisClient.status === 'ready') {
        await redisClient.flushall();
      }
    } catch (e) {}
    memoryStore.clear();
    return true;
  }
}

module.exports = new UnifiedRedisCache();
