import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Analysis from '../models/Analysis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MediaController {
    async getAudio(req, res) {
        try {
            const analysis = await Analysis.findById(req.params.id).select('audioData audioMimeType');
            
            if (!analysis || !analysis.audioData) {
                return res.status(404).json({ error: 'Audio not found' });
            }
            
            res.setHeader('Content-Type', analysis.audioMimeType || 'audio/wav');
            res.setHeader('Content-Length', analysis.audioData.length);
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.setHeader('Accept-Ranges', 'bytes');
            res.send(analysis.audioData);
            
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getFallbackScreenshot(req, res) {
        try {
            const defaultImagePath = path.join(__dirname, '../../public/default-screenshot.png');
            
            if (fs.existsSync(defaultImagePath)) {
                res.sendFile(defaultImagePath);
            } else {
                const svgPlaceholder = `
                    <svg width="640" height="360" xmlns="http://www.w3.org/2000/svg">
                        <rect width="640" height="360" fill="#f0f0f0"/>
                        <text x="320" y="180" text-anchor="middle" font-family="Arial" font-size="24" fill="#666">
                            📺 Video Screenshot
                        </text>
                        <text x="320" y="210" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">
                            Screenshot unavailable
                        </text>
                    </svg>
                `;
                
                res.setHeader('Content-Type', 'image/svg+xml');
                res.send(svgPlaceholder);
            }
            
        } catch (error) {
            res.status(500).json({ error: 'Cannot serve fallback screenshot' });
        }
    }
}

export default new MediaController();