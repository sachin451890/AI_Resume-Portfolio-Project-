const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { requireAuth } = require('../middleware/auth');

// Protected Export Endpoints (Requires Supabase Authentication)
router.post('/generate', requireAuth, pdfController.generatePDF);
router.post('/:id/export', requireAuth, pdfController.generatePDF);
router.post('/:id/pdf', requireAuth, pdfController.generatePDF);
router.get('/:id/download', requireAuth, pdfController.generatePDF);

module.exports = router;
