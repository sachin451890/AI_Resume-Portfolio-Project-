const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const redisService = require('../services/redisService');

const JWT_SECRET = process.env.JWT_SECRET || config.jwtSecret || 'ai_resume_super_secret_jwt_key_2026';

let supabase = null;
if (config.supabaseUrl && config.supabaseServiceRoleKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization: Bearer <token>
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in with a valid JWT token.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Valid JWT token missing.'
      });
    }

    // 1. Check Redis Session Cache for instant JWT lookup
    const cachedUser = await redisService.getUserSession(token);
    if (cachedUser) {
      req.user = cachedUser;
      req.token = token;
      return next();
    }

    // 2. Verify JWT token Signature with jsonwebtoken
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      req.token = token;

      // Cache session in Redis
      await redisService.cacheUserSession(token, decoded);
      return next();
    } catch (jwtErr) {
      // 3. Fallback: Supabase JWT Check if configured
      if (supabase) {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          req.user = {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata || {}
          };
          req.token = token;
          await redisService.cacheUserSession(token, req.user);
          return next();
        }
      }

      // Demo token fallback for local dev
      if (token === 'demo-token') {
        req.user = { id: 'user_demo_123', email: 'demo@example.com', fullName: 'Demo User' };
        req.token = token;
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid or expired JWT token. Please sign in again.'
      });
    }
  } catch (err) {
    console.error('[JWT Auth Middleware Error]:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid JWT credentials.'
    });
  }
};

module.exports = {
  requireAuth,
  JWT_SECRET
};
