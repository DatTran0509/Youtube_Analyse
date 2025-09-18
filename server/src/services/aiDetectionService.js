import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SAPLING_API_KEY = process.env.SAPLING_API_KEY;
const SAPLING_API_URL = process.env.SAPLING_API_URL;

export const analyzeTranscript = async (transcript) => {
    if (!transcript || transcript.length === 0) {
        return [{
            id: 0,
            text: "No transcript available",
            start: 0,
            end: 0,
            speaker: 'unknown',
            ai_probability: null,
            analysis: 'no_data',
            confidence: 'unknown',
            error: 'No transcript data'
        }];
    }

    console.log(`🤖 Starting AI analysis for ${transcript.length} segments...`);
    
    // Analyze each segment individually
    const results = [];
    for (let i = 0; i < transcript.length; i++) {
        const segment = transcript[i];
        console.log(`📝 Analyzing segment ${i + 1}/${transcript.length}: "${segment.text.substring(0, 50)}..."`);
        
        const analysis = await analyzeSingleSegment(segment.text);
        
        results.push({
            ...segment,
            id: i,
            ai_probability: analysis.score,
            analysis: analysis.verdict,
            confidence: analysis.confidence,
            error: analysis.error
        });
        
        // Small delay to avoid rate limiting
        if (i < transcript.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    console.log(`✅ AI analysis completed for all ${results.length} segments`);
    return results;
};

const analyzeSingleSegment = async (text) => {

    if (!SAPLING_API_KEY) {
        return {
            score: Math.random() * 0.3 + 0.1, // Mock low score
            verdict: 'mock_analysis',
            confidence: 'low',
            error: 'API key not configured'
        };
    }

    try {
        const response = await axios.post(SAPLING_API_URL, {
            key: SAPLING_API_KEY,
            text: text.trim(),
            sent_scores: false
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
        });

        if (!response.data || typeof response.data.score !== 'number') {
            return {
                score: null,
                verdict: 'invalid_response',
                confidence: 'unknown',
                error: 'Invalid API response'
            };
        }

        const score = response.data.score;
        return {
            score: Math.round(score * 1000) / 1000,
            verdict: getVerdict(score),
            confidence: getConfidence(score),
            error: null
        };

    } catch (error) {
        console.error(`❌ Analysis failed for text: "${text.substring(0, 30)}..."`, error.message);
        
        return {
            score: null,
            verdict: 'analysis_failed',
            confidence: 'unknown',
            error: getErrorMessage(error)
        };
    }
};

const getVerdict = (score) => {
    if (score > 0.8) return 'AI_GENERATED';
    if (score > 0.6) return 'LIKELY_AI';
    if (score > 0.4) return 'MIXED_CONTENT';
    if (score > 0.2) return 'LIKELY_HUMAN';
    return 'HUMAN_CREATED';
};

const getConfidence = (score) => {
    if (score > 0.8 || score < 0.2) return 'high';
    if (score > 0.6 || score < 0.4) return 'medium';
    return 'low';
};

const getErrorMessage = (error) => {
    if (error.response?.status === 429) return 'Rate limit exceeded';
    if (error.response?.status === 401) return 'Invalid API key';
    if (error.code === 'ECONNABORTED') return 'Request timeout';
    return 'Analysis service error';
};