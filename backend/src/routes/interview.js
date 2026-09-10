const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { requireAuth } = require('../middleware/auth');

router.post('/generate-questions', requireAuth, interviewController.generateQuestions);
router.post('/evaluate-answer', requireAuth, interviewController.evaluateAnswer);

module.exports = router;
