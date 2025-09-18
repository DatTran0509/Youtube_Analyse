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

export const processYouTubeUrl = async (url) => {
    let analysisId = null;
    
    try {
        console.log('🎬 Starting video processing...');
        
        // 1. Create analysis record
        const analysis = new Analysis({
            youtubeUrl: url,
            status: 'processing'
        });
        
        const savedAnalysis = await analysis.save();
        analysisId = savedAnalysis._id;
        console.log(`📝 Analysis created: ${analysisId}`);

        // 2. Get video title
        let videoTitle = 'Unknown Video';
        try {
            const { stdout } = await execAsync(`yt-dlp --print title "${url}"`);
            videoTitle = stdout.trim();
        } catch (error) {
            console.warn('⚠️ Could not fetch video title');
        }
        
        // 3. Take screenshot
        console.log('📸 Taking screenshot...');
        const screenshotResult = await takeScreenshotAndUpload(url, analysisId);
        
        // 4. Download and process audio
        console.log('🎵 Processing audio...');
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const timestamp = Date.now();
        const audioPath = path.join(uploadsDir, `${timestamp}.%(ext)s`);
        const wavPath = path.join(uploadsDir, `${timestamp}.wav`);
        
        try {
            // Download audio
            await execAsync(`yt-dlp -f "bestaudio" -o "${audioPath}" "${url}"`);
            
            // Find downloaded file
            const files = fs.readdirSync(uploadsDir).filter(file => file.startsWith(timestamp.toString()));
            const actualAudioPath = path.join(uploadsDir, files[0]);
            
            // Convert to WAV
            await convertToWav(actualAudioPath, wavPath);
            
            // Read audio buffer
            const audioBuffer = fs.readFileSync(wavPath);
            
            // 5. Generate transcript
            console.log('📝 Generating transcript...');
            const transcriptionResponse = await sendAudioForTranscription(wavPath);
            const transcript = processTranscriptionResponse(transcriptionResponse);
            
            // 6. Analyze each segment for AI detection
            console.log('🤖 Analyzing transcript segments...');
            const analyzedTranscript = await analyzeTranscript(transcript);
            
            // 7. Save final result
            const updatedAnalysis = await Analysis.findByIdAndUpdate(analysisId, {
                videoTitle,
                screenshotUrl: screenshotResult.screenshotUrl,
                screenshotCloudinaryId: screenshotResult.screenshotCloudinaryId,
                audioData: audioBuffer,
                audioMimeType: 'audio/wav',
                audioSize: audioBuffer.length,
                transcript: analyzedTranscript,
                status: 'completed',
                completedAt: new Date()
            }, { new: true });
            
            // 8. Cleanup
            if (fs.existsSync(actualAudioPath)) fs.unlinkSync(actualAudioPath);
            if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
            
            console.log('🎉 Analysis completed successfully');
            return updatedAnalysis;
            
        } catch (audioError) {
            console.error('❌ Audio processing failed:', audioError.message);
            
            // Save with screenshot only
            const updatedAnalysis = await Analysis.findByIdAndUpdate(analysisId, {
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
                    speaker: 'unknown',
                    ai_probability: null,
                    analysis: 'processing_failed',
                    confidence: 'unknown',
                    error: 'Audio processing failed'
                }],
                status: 'completed',
                completedAt: new Date()
            }, { new: true });
            
            return updatedAnalysis;
        }
        
    } catch (error) {
        console.error('❌ Processing failed:', error);
        
        if (analysisId) {
            await Analysis.findByIdAndUpdate(analysisId, {
                status: 'failed',
                completedAt: new Date()
            });
        }
        
        throw error;
    }
};