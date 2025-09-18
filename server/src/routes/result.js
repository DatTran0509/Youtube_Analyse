import express from 'express';
import ResultController from '../controllers/resultController.js';

const router = express.Router();

// Get specific analysis result
router.get('/:id', ResultController.getResult);

// Get analysis summary (lighter response)
router.get('/:id/summary', ResultController.getAnalysisSummary);

// Get all analyses (paginated)
router.get('/', ResultController.getAllAnalyses);

export default router;