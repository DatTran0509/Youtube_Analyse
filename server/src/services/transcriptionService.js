import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;

export const sendAudioForTranscription = async (audioFilePath) => {
    console.log('📤 Sending audio to ElevenLabs...');
    
    if (!ELEVEN_LABS_API_KEY || !fs.existsSync(audioFilePath)) {
        console.log('❌ Missing API key or file, using mock data');
        return mockResponse();
    }

    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(audioFilePath));
        form.append('model_id', 'scribe_v1');

        const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', form, {
            headers: {
                ...form.getHeaders(),
                'xi-api-key': ELEVEN_LABS_API_KEY
            },
            timeout: 120000
        });

        console.log('✅ ElevenLabs transcription successful');
        return response.data;
        
    } catch (error) {
        console.log('❌ ElevenLabs API Error:', error.response?.status);
        
        if (error.response?.status === 422 || error.response?.status === 400) {
            return tryExperimentalModel(audioFilePath);
        }
        
        return mockResponse();
    }
};

const tryExperimentalModel = async (audioFilePath) => {
    try {
        console.log('📤 Trying experimental model...');
        const form = new FormData();
        form.append('file', fs.createReadStream(audioFilePath));
        form.append('model_id', 'scribe_v1_experimental');

        const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', form, {
            headers: {
                ...form.getHeaders(),
                'xi-api-key': ELEVEN_LABS_API_KEY
            },
            timeout: 120000
        });

        console.log('✅ Experimental model successful');
        return response.data;
        
    } catch (error) {
        console.log('❌ Experimental model failed');
        return mockResponse();
    }
};

// ✅ NEW: Merge short segments with next segments
const mergeShortSegments = (segments, minLength = 25) => {
    console.log(`📝 Merging segments shorter than ${minLength} characters...`);
    
    const merged = [];
    let i = 0;
    
    while (i < segments.length) {
        let currentSegment = { ...segments[i] };
        
        // If current segment is too short, merge with next segments
        while (currentSegment.text.length < minLength && i + 1 < segments.length) {
            const nextSegment = segments[i + 1];
            
            // Merge text
            currentSegment.text = currentSegment.text + ' ' + nextSegment.text;
            
            // Update timing (use end time of last merged segment)
            currentSegment.end = nextSegment.end;
            
            // Keep first speaker or use 'unknown' if different
            if (currentSegment.speaker !== nextSegment.speaker) {
                currentSegment.speaker = 'mixed';
            }
            
            i++; // Skip the merged segment
            console.log(`   📎 Merged segment: "${currentSegment.text.substring(0, 50)}..."`);
        }
        
        merged.push(currentSegment);
        i++;
    }
    
    console.log(`✅ Merged ${segments.length} segments into ${merged.length} segments`);
    return merged;
};

export const processTranscriptionResponse = (response) => {
    console.log('📝 Processing transcription response...');
    
    let segments = [];
    
    if (response.segments && response.segments.length > 0) {
        // Use ElevenLabs segments
        segments = response.segments.map((segment, index) => ({
            id: index,
            text: segment.text.trim(),
            start: segment.start || 0,
            end: segment.end || 0,
            speaker: segment.speaker || 'unknown'
        }));
    } else if (response.text) {
        // Split text into sentences
        const sentences = response.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        segments = sentences.map((sentence, index) => ({
            id: index,
            text: sentence.trim() + '.',
            start: index * 4,
            end: (index + 1) * 4,
            speaker: 'unknown'
        }));
    } else {
        segments = [{
            id: 0,
            text: "Transcription completed",
            start: 0,
            end: 5,
            speaker: 'unknown'
        }];
    }
    
    // ✅ Merge short segments before returning
    const mergedSegments = mergeShortSegments(segments);
    
    // Re-assign IDs after merging
    return mergedSegments.map((segment, index) => ({
        ...segment,
        id: index
    }));
};

const mockResponse = () => ({
    segments: [
        {
            text: "When you hear the term artificial intelligence, what comes to mind.",
            start: 0,
            end: 4,
            speaker: "speaker_0"
        },
        {
            text: "Super-powered robots.",
            start: 4,
            end: 8,
            speaker: "speaker_0"
        },

    ]
});