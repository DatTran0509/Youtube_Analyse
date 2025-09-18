import { processYouTubeUrl } from '../services/youtubeService.js';

class AnalyzeController {
    async analyzeVideo(req, res) {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }

        try {
            const result = await processYouTubeUrl(url);

            return res.status(200).json({ 
                success: true,
                message: 'Analysis completed successfully',
                data: {
                    id: result._id,
                    videoTitle: result.videoTitle,
                    screenshotPath: result.screenshotPath,
                    audioPath: result.audioPath,
                    transcriptCount: result.transcript.length,
                    status: result.status,
                    completedAt: result.completedAt
                }
            });
        } catch (error) {
            return res.status(500).json({ 
                success: false,
                error: 'Analysis failed: ' + error.message 
            });
        }
    }
}

export default new AnalyzeController();