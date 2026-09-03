const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/improve-summary', aiController.improveSummary);
router.post('/improve-experience', aiController.improveExperience);
router.post('/improve-project', aiController.improveProject);
router.post('/suggest-skills', aiController.suggestSkills);
router.post('/ats-score', aiController.calculateATSScore);
router.post('/job-match', aiController.matchJobDescription);
router.post('/cover-letter', aiController.generateCoverLetter);

module.exports = router;
