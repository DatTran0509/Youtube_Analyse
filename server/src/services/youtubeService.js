import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { takeScreenshotAndUpload } from './screenshotService.js';
import { convertToWav } from '../utils/ffmpeg.js';
import { sendAudioForTranscription, processTranscriptionResponse } from './transcriptionService.js';
import { analyzeTranscript } from './aiDetectionService.js';
import Analysis from '../models/Analysis.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processYouTubeUrl = async (url, analysisId = null, userId = null) => {
    let currentAnalysisId = analysisId;

    try {
        if (!url.includes('youtube.com/watch') && !url.includes('youtu.be/')) {
            throw new Error('Invalid YouTube URL');
        }

        // Nếu không có analysisId, tạo mới (backward compatibility)
        if (!currentAnalysisId) {
            const analysis = new Analysis({
                youtubeUrl: url,
                userId: userId, // Thêm userId nếu có
                status: 'processing'
            });

            const savedAnalysis = await analysis.save();
            currentAnalysisId = savedAnalysis._id;
        }

        let videoTitle = 'Unknown Video';
        try {
            const { stdout } = await execAsync(`yt-dlp --print title "${url}"`);
            videoTitle = stdout.trim();
        } catch (error) {
            videoTitle = 'Video Title Unavailable';
        }

        const screenshotResult = await takeScreenshotAndUpload(url, currentAnalysisId);

        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const timestamp = Date.now();
        const audioPath = path.join(uploadsDir, `${timestamp}.%(ext)s`);
        const wavPath = path.join(uploadsDir, `${timestamp}.wav`);

        try {
            await execAsync(`yt-dlp -f "bestaudio" -o "${audioPath}" "${url}"`);

            const files = fs.readdirSync(uploadsDir).filter(file => file.startsWith(timestamp.toString()));
            const actualAudioPath = path.join(uploadsDir, files[0]);

            await convertToWav(actualAudioPath, wavPath);
            const audioBuffer = fs.readFileSync(wavPath);

            const transcriptionResponse = await sendAudioForTranscription(wavPath);
            const transcript = processTranscriptionResponse(transcriptionResponse);
            const analyzedTranscript = await analyzeTranscript(transcript);

            // Cập nhật với userId nếu có
            const updateData = {
                videoTitle,
                screenshotUrl: screenshotResult.screenshotUrl,
                screenshotCloudinaryId: screenshotResult.screenshotCloudinaryId,
                audioData: audioBuffer,
                audioMimeType: 'audio/wav',
                audioSize: audioBuffer.length,
                transcript: analyzedTranscript,
                status: 'completed',
                completedAt: new Date()
            };

            // Chỉ thêm userId nếu có
            if (userId) {
                updateData.userId = userId;
            }

            const updatedAnalysis = await Analysis.findByIdAndUpdate(currentAnalysisId, updateData, { new: true });

            if (fs.existsSync(actualAudioPath)) fs.unlinkSync(actualAudioPath);
            if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);

            return updatedAnalysis;

        } catch (audioError) {
            // Cập nhật khi audio processing failed
            const updateData = {
                videoTitle,
                screenshotUrl: screenshotResult.screenshotUrl,
                screenshotCloudinaryId: screenshotResult.screenshotCloudinaryId,
                audioData: null,
                audioSize: 0,
                transcript: [{
                    id: 0,
                    text: "Audio processing failed",
                    start: 0,
                    end: 0,
                    ai_probability: null,
                    analysis: 'HUMAN',
                    error: 'Audio processing failed'
                }],
                status: 'completed',
                completedAt: new Date()
            };

            // Chỉ thêm userId nếu có
            if (userId) {
                updateData.userId = userId;
            }

            const updatedAnalysis = await Analysis.findByIdAndUpdate(currentAnalysisId, updateData, { new: true });

            return updatedAnalysis;
        }

    } catch (error) {
        if (currentAnalysisId) {
            const updateData = {
                status: 'failed',
                completedAt: new Date()
            };

            // Chỉ thêm userId nếu có
            if (userId) {
                updateData.userId = userId;
            }

            await Analysis.findByIdAndUpdate(currentAnalysisId, updateData);
        }

        throw error;
    }
};