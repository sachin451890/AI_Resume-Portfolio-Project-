const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Public Auth Endpoints (Returns signed JWT tokens)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Authenticated Endpoints (Requires valid JWT Bearer Token)
router.get('/me', requireAuth, authController.getProfile);
router.put('/profile', requireAuth, authController.updateProfile);
router.post('/logout', requireAuth, authController.logout);

module.exports = router;
