import express from 'express';
import analysisController from '../controllers/analysisController.js';
import { simpleAuth } from '../middleware/auth.js';
const router = express.Router();

// Simple auth check - chỉ cần userId từ frontend


router.post('/analyze', simpleAuth, analysisController.createAnalysis);
router.get('/user/analyses', simpleAuth, analysisController.getUserAnalyses);

export default router;