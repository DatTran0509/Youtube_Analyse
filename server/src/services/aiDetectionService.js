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
            analysis: 'MIXED',
            confidence: 'unknown',
            error: 'No transcript data'
        }];
    }

    const results = [];
    for (let i = 0; i < transcript.length; i++) {
        const segment = transcript[i];
        const analysis = await analyzeSingleSegment(segment.text);
        
        results.push({
            ...segment,
            id: i,
            ai_probability: analysis.score,
            analysis: analysis.verdict,
            confidence: analysis.confidence,
            error: analysis.error
        });
        
        if (i < transcript.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    return results;
};

const analyzeSingleSegment = async (text) => {
    if (!text || text.trim().length < 10) {
        return {
            score: 0.5,
            verdict: 'MIXED',
            confidence: 'low',
            error: null
        };
    }

    if (!SAPLING_API_KEY) {
        return {
            score: Math.random() * 0.3 + 0.1,
            verdict: 'HUMAN',
            confidence: 'low',
            error: null
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
                score: 0.5,
                verdict: 'MIXED',
                confidence: 'low',
                error: null
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
        return {
            score: 0.5,
            verdict: 'MIXED',
            confidence: 'low',
            error: null
        };
    }
};

const getVerdict = (score) => {
    if (score > 0.6) return 'AI';
    if (score < 0.4) return 'HUMAN';
    return 'MIXED';
};

const getConfidence = (score) => {
    if (score > 0.8 || score < 0.2) return 'high';
    if (score > 0.6 || score < 0.4) return 'medium';
    return 'low';
};