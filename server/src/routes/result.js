import express from 'express';
import resultController from '../controllers/resultController.js';
import { simpleAuth } from '../middleware/auth.js';

const resultRoutes = express.Router();

resultRoutes.get('/:id',simpleAuth, resultController.getResult);
resultRoutes.get('/:id/summary',simpleAuth, resultController.getAnalysisSummary);

export default resultRoutes;