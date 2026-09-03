const express = require('express');
const router = express.Router();
const resumesController = require('../controllers/resumesController');

router.get('/', resumesController.getAllResumes);
router.get('/:id', resumesController.getResumeById);
router.post('/', resumesController.createResume);
router.put('/:id', resumesController.updateResume);
router.delete('/:id', resumesController.deleteResume);
router.post('/:id/duplicate', resumesController.duplicateResume);

module.exports = router;
