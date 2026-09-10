const redisCache = require('../config/redis');

class RedisService {
  // ==========================================
  // 1. USER CREDENTIALS & SESSION CACHING
  // ==========================================
  
  /**
   * Cache authenticated user credentials & session token
   * Default TTL: 24 hours (86400 seconds)
   */
  async cacheUserSession(token, userData, ttlSeconds = 86400) {
    if (!token || !userData) return null;
    const sessionKey = `session:${token}`;
    const userCredentialKey = `user:${userData.id}:credentials`;

    await redisCache.set(sessionKey, userData, ttlSeconds);
    await redisCache.set(userCredentialKey, {
      id: userData.id,
      email: userData.email,
      role: userData.role || 'user',
      metadata: userData.user_metadata || {},
      lastActive: new Date().toISOString()
    }, ttlSeconds);

    return true;
  }

  /**
   * Get cached user session by auth token
   */
  async getUserSession(token) {
    if (!token) return null;
    return await redisCache.get(`session:${token}`);
  }

  /**
   * Invalidate/Logout user session cache
   */
  async invalidateUserSession(token, userId) {
    if (token) await redisCache.del(`session:${token}`);
    if (userId) await redisCache.del(`user:${userId}:credentials`);
    return true;
  }

  // ==========================================
  // 2. RESUME STRUCTURE CACHING
  // ==========================================

  /**
   * Cache full resume structure (JSON data, sections, theme config)
   * Default TTL: 12 hours (43200 seconds)
   */
  async cacheResumeStructure(resumeId, resumeData, ttlSeconds = 43200) {
    if (!resumeId || !resumeData) return null;
    const cacheKey = `resume:${resumeId}`;
    return await redisCache.set(cacheKey, resumeData, ttlSeconds);
  }

  /**
   * Fetch cached resume structure by resume ID
   */
  async getCachedResumeStructure(resumeId) {
    if (!resumeId) return null;
    return await redisCache.get(`resume:${resumeId}`);
  }

  /**
   * Cache list of user's saved resumes
   */
  async cacheUserResumesList(userId, resumesList, ttlSeconds = 1800) {
    if (!userId || !resumesList) return null;
    return await redisCache.set(`user:${userId}:resumes`, resumesList, ttlSeconds);
  }

  /**
   * Fetch cached list of user resumes
   */
  async getCachedUserResumesList(userId) {
    if (!userId) return null;
    return await redisCache.get(`user:${userId}:resumes`);
  }

  /**
   * Invalidate cached resume structure
   */
  async invalidateResumeCache(resumeId, userId) {
    if (resumeId) await redisCache.del(`resume:${resumeId}`);
    if (userId) await redisCache.del(`user:${userId}:resumes`);
    return true;
  }

  // ==========================================
  // 3. PUBLIC PORTFOLIO WEBSITE CACHING
  // ==========================================

  /**
   * Cache published portfolio website structure
   * Default TTL: 1 hour (3600 seconds)
   */
  async cachePortfolio(username, portfolioData, ttlSeconds = 3600) {
    if (!username || !portfolioData) return null;
    return await redisCache.set(`portfolio:${username.toLowerCase()}`, portfolioData, ttlSeconds);
  }

  /**
   * Get cached public portfolio by username
   */
  async getCachedPortfolio(username) {
    if (!username) return null;
    return await redisCache.get(`portfolio:${username.toLowerCase()}`);
  }

  /**
   * Clear public portfolio cache
   */
  async invalidatePortfolioCache(username) {
    if (username) await redisCache.del(`portfolio:${username.toLowerCase()}`);
    return true;
  }
}

module.exports = new RedisService();
