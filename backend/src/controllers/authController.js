const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const redisService = require('../services/redisService');
const { JWT_SECRET } = require('../middleware/auth');

let supabase = null;
if (config.supabaseUrl && config.supabaseServiceRoleKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
}

// Local mock user database store for dev fallback
const localUsersStore = new Map();

/**
 * Generate signed JWT Token for user
 */
function generateJwtToken(userPayload) {
  return jwt.sign(
    {
      id: userPayload.id,
      email: userPayload.email,
      fullName: userPayload.fullName || userPayload.user_metadata?.full_name || 'User',
      role: userPayload.role || 'user',
      user_metadata: userPayload.user_metadata || {}
    },
    JWT_SECRET,
    { expiresIn: '7d' } // JWT Token valid for 7 days
  );
}

/**
 * User Registration API - Generates JWT Token & Caches in Redis
 */
exports.register = async (req, res) => {
  try {
    const { email, password, fullName = 'Professional User' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let userObj = null;

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      userObj = data.user;
    } else {
      // Local dev fallback store
      const userId = `usr_${Date.now()}`;
      userObj = {
        id: userId,
        email,
        user_metadata: { full_name: fullName },
        created_at: new Date().toISOString()
      };
      localUsersStore.set(email, { ...userObj, password });
    }

    // Generate signed JWT token
    const token = generateJwtToken(userObj);

    // Cache session & user credentials in Redis
    await redisService.cacheUserSession(token, userObj);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: userObj.id,
        email: userObj.email,
        fullName: userObj.user_metadata?.full_name || fullName,
        user_metadata: userObj.user_metadata || {}
      }
    });
  } catch (err) {
    console.error('[Register Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Registration failed.' });
  }
};

/**
 * User Login API - Verifies Credentials, Signs JWT & Caches in Redis
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let userObj = null;

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        return res.status(401).json({ success: false, message: error?.message || 'Invalid login credentials.' });
      }

      userObj = data.user;
    } else {
      // Local dev fallback lookup
      const existing = localUsersStore.get(email);
      if (!existing || existing.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
      userObj = existing;
    }

    // Generate JWT token
    const token = generateJwtToken(userObj);

    // Cache session in Redis
    await redisService.cacheUserSession(token, userObj);

    return res.json({
      success: true,
      message: 'Authenticated successfully!',
      token,
      user: {
        id: userObj.id,
        email: userObj.email,
        fullName: userObj.user_metadata?.full_name || 'User',
        user_metadata: userObj.user_metadata || {}
      }
    });
  } catch (err) {
    console.error('[Login Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Authentication failed.' });
  }
};

/**
 * Get User Profile (JWT Authenticated)
 */
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName || user.user_metadata?.full_name || 'User',
        phone: user.user_metadata?.phone || '',
        bio: user.user_metadata?.bio || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
        targetRole: user.user_metadata?.target_role || ''
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

/**
 * Update User Profile (JWT Authenticated)
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, bio, avatarUrl, targetRole } = req.body;

    const updatedMetadata = {
      ...req.user.user_metadata,
      full_name: fullName || req.user.fullName,
      phone: phone || '',
      bio: bio || '',
      avatar_url: avatarUrl || '',
      target_role: targetRole || ''
    };

    let updatedUser = {
      ...req.user,
      fullName: updatedMetadata.full_name,
      user_metadata: updatedMetadata
    };

    if (supabase) {
      const { data, error } = await supabase.auth.updateUser({
        data: updatedMetadata
      });
      if (!error && data.user) {
        updatedUser = { ...data.user, fullName: updatedMetadata.full_name };
      }
    }

    // Re-issue updated JWT token & refresh Redis cache
    const newJwtToken = generateJwtToken(updatedUser);
    await redisService.cacheUserSession(newJwtToken, updatedUser);

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      token: newJwtToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedMetadata.full_name,
        phone: updatedMetadata.phone,
        bio: updatedMetadata.bio,
        avatarUrl: updatedMetadata.avatar_url,
        targetRole: updatedMetadata.target_role
      }
    });
  } catch (err) {
    console.error('[Update Profile Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

/**
 * User Logout API - Invalidates JWT Session in Redis Cache
 */
exports.logout = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.user?.id;

    await redisService.invalidateUserSession(token, userId);

    return res.json({
      success: true,
      message: 'Logged out successfully! JWT session invalidated.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Logout failed.' });
  }
};
