const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const { requireAuth } = require('../middleware/auth');

// Public Payment Config / Regions Route
router.get('/regions', (req, res) => {
  const { REGIONS } = require('../config/pricing');
  res.json({ success: true, regions: REGIONS });
});

// Protected Payment Endpoints
router.post('/create-order', requireAuth, paymentsController.createOrder);
router.post('/verify', requireAuth, paymentsController.verifyPayment);
router.get('/history', requireAuth, paymentsController.getBillingHistory);

// Public Webhook Endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    req.rawBody = req.body.toString('utf8');
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (e) {}
  }
  next();
}, paymentsController.handleWebhook);

module.exports = router;
