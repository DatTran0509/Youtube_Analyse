import express from 'express';
import MediaController from '../controllers/mediaController.js';

const mediaRoutes = express.Router();

mediaRoutes.get('/audio/:id', MediaController.getAudio);
// mediaRoutes.get('/fallback-screenshot', MediaController.getFallbackScreenshot);

export default mediaRoutes;