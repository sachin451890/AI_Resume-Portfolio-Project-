const express = require('express');
const router = express.Router();
const portfoliosController = require('../controllers/portfoliosController');

router.get('/:username', portfoliosController.getPortfolioByUsername);
router.post('/save', portfoliosController.updatePortfolio);
router.post('/:username/contact', portfoliosController.sendContactMessage);
router.post('/parse-resume-to-portfolio', portfoliosController.parseResumeToPortfolio);
router.post('/generate-project-readme', portfoliosController.generateProjectReadme);

module.exports = router;
