import express from 'express';
import analyzeController from '../controllers/analyzeController.js';
import { validateYouTubeUrl, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// POST /analyze route for submitting YouTube URLs
router.post('/analyze', validateYouTubeUrl, handleValidationErrors, analyzeController.analyzeVideo);

export default router;