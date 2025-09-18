import Analysis from '../models/Analysis.js';

// ✅ Clean AI Summary Generator
const generateAISummary = (transcript) => {
    // Handle empty or invalid transcript
    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
        return {
            verdict: 'NO_DATA',
            confidence: 'unknown',
            aiProbability: null,
            totalSegments: 0,
            aiSegments: 0,
            humanSegments: 0,
            aiPercentage: 0,
            humanPercentage: 0,
            error: 'No transcript data available'
        };
    }

    // Check for analysis errors
    const errorSegments = transcript.filter(segment => segment.error);
    if (errorSegments.length > 0) {
        return {
            verdict: 'ANALYSIS_ERROR',
            confidence: 'unknown',
            aiProbability: null,
            totalSegments: transcript.length,
            aiSegments: 0,
            humanSegments: 0,
            aiPercentage: 0,
            humanPercentage: 0,
            error: `${errorSegments.length} segments failed analysis`
        };
    }

    // Filter valid segments with AI probability
    const validSegments = transcript.filter(segment => 
        segment && 
        typeof segment.ai_probability === 'number' && 
        segment.ai_probability >= 0 && 
        segment.ai_probability <= 1
    );

    if (validSegments.length === 0) {
        return {
            verdict: 'NO_ANALYSIS',
            confidence: 'unknown',
            aiProbability: null,
            totalSegments: transcript.length,
            aiSegments: 0,
            humanSegments: 0,
            aiPercentage: 0,
            humanPercentage: 0,
            error: 'No valid AI analysis found'
        };
    }

    // Calculate metrics
    const aiProbabilities = validSegments.map(segment => segment.ai_probability);
    const avgAiProbability = aiProbabilities.reduce((sum, prob) => sum + prob, 0) / aiProbabilities.length;
    
    // Count segments by AI probability thresholds
    const aiSegments = aiProbabilities.filter(prob => prob > 0.5).length; // >50% = AI
    const humanSegments = aiProbabilities.filter(prob => prob <= 0.5).length; // <=50% = Human
    const highAiSegments = aiProbabilities.filter(prob => prob > 0.8).length; // >80% = High AI
    const highHumanSegments = aiProbabilities.filter(prob => prob < 0.2).length; // <20% = High Human
    
    const aiPercentage = Math.round((aiSegments / validSegments.length) * 100);
    const humanPercentage = Math.round((humanSegments / validSegments.length) * 100);

    // Determine overall verdict based on average and distribution
    let verdict, confidence;
    
    if (avgAiProbability > 0.8 && aiPercentage > 80) {
        verdict = 'HIGHLY_AI_GENERATED';
        confidence = 'very_high';
    } else if (avgAiProbability > 0.6 && aiPercentage > 60) {
        verdict = 'MOSTLY_AI_GENERATED';
        confidence = 'high';
    } else if (avgAiProbability > 0.4 && aiPercentage > 40) {
        verdict = 'MIXED_CONTENT';
        confidence = 'medium';
    } else if (avgAiProbability > 0.2 && aiPercentage > 20) {
        verdict = 'MOSTLY_HUMAN_CREATED';
        confidence = 'medium';
    } else {
        verdict = 'HIGHLY_HUMAN_CREATED';
        confidence = 'high';
    }

    return {
        verdict,
        confidence,
        aiProbability: Math.round(avgAiProbability * 100) / 100,
        totalSegments: validSegments.length,
        aiSegments,
        humanSegments,
        aiPercentage,
        humanPercentage,
        error: null,
        details: {
            averageAiProbability: Math.round(avgAiProbability * 1000) / 1000,
            highAiSegments, // >80% AI probability
            highHumanSegments, // <20% AI probability
            mixedSegments: validSegments.length - highAiSegments - highHumanSegments,
            distributionBreakdown: {
                veryHighAI: aiProbabilities.filter(p => p > 0.9).length, // >90%
                highAI: aiProbabilities.filter(p => p > 0.7 && p <= 0.9).length, // 70-90%
                mediumAI: aiProbabilities.filter(p => p > 0.5 && p <= 0.7).length, // 50-70%
                mediumHuman: aiProbabilities.filter(p => p > 0.3 && p <= 0.5).length, // 30-50%
                highHuman: aiProbabilities.filter(p => p > 0.1 && p <= 0.3).length, // 10-30%
                veryHighHuman: aiProbabilities.filter(p => p <= 0.1).length // <=10%
            }
        }
    };
};

class ResultController {
    async getResult(req, res) {
        const { id } = req.params;

        try {
            const analysis = await Analysis.findById(id);
            
            if (!analysis) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Analysis not found' 
                });
            }
            
            const response = {
                success: true,
                data: {
                    id: analysis._id,
                    youtubeUrl: analysis.youtubeUrl,
                    videoTitle: analysis.videoTitle,
                    status: analysis.status,
                    transcript: analysis.transcript || [],
                    createdAt: analysis.createdAt,
                    completedAt: analysis.completedAt,
                    
                    // Media URLs
                    screenshotUrl: analysis.screenshotUrl || `/api/media/fallback-screenshot`,
                    audioUrl: analysis.audioData ? `/api/media/audio/${analysis._id}` : null,
                    
                    // Metadata
                    audioSize: analysis.audioSize || 0,
                    audioMimeType: analysis.audioMimeType || 'audio/wav',
                    screenshotCloudinaryId: analysis.screenshotCloudinaryId || null,
                    
                    // ✅ Updated AI Analysis Summary
                    aiAnalysisSummary: generateAISummary(analysis.transcript || [])
                }
            };
            
            res.status(200).json(response);
            
        } catch (error) {
            console.error('Error fetching analysis result:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }

    async getAnalysisSummary(req, res) {
        const { id } = req.params;

        try {
            const analysis = await Analysis.findById(id).select('-audioData');
            
            if (!analysis) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Analysis not found' 
                });
            }

            const aiSummary = generateAISummary(analysis.transcript || []);

            const summary = {
                success: true,
                data: {
                    id: analysis._id,
                    youtubeUrl: analysis.youtubeUrl,
                    videoTitle: analysis.videoTitle,
                    status: analysis.status,
                    createdAt: analysis.createdAt,
                    completedAt: analysis.completedAt,
                    screenshotUrl: analysis.screenshotUrl || `/api/media/fallback-screenshot`,
                    
                    // Basic metrics
                    hasAudio: !!analysis.audioSize,
                    audioSize: analysis.audioSize || 0,
                    transcriptSegments: (analysis.transcript || []).length,
                    
                    // ✅ Enhanced AI Analysis Summary
                    aiAnalysisSummary: aiSummary,
                    
                    // ✅ Quick overview
                    quickSummary: {
                        verdict: aiSummary.verdict,
                        confidence: aiSummary.confidence,
                        aiPercentage: aiSummary.aiPercentage,
                        humanPercentage: aiSummary.humanPercentage,
                        hasErrors: !!aiSummary.error
                    }
                }
            };

            res.status(200).json(summary);
            
        } catch (error) {
            console.error('Error fetching analysis summary:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }

    async getAllAnalyses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const analyses = await Analysis.find()
                .select('-audioData -transcript') // Exclude heavy data for list view
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Analysis.countDocuments();

            // Get basic AI summary for each analysis
            const analysesWithSummary = await Promise.all(
                analyses.map(async (analysis) => {
                    // Get transcript for AI summary (without audioData)
                    const fullAnalysis = await Analysis.findById(analysis._id).select('transcript');
                    const aiSummary = generateAISummary(fullAnalysis.transcript || []);
                    
                    return {
                        id: analysis._id,
                        youtubeUrl: analysis.youtubeUrl,
                        videoTitle: analysis.videoTitle,
                        status: analysis.status,
                        createdAt: analysis.createdAt,
                        completedAt: analysis.completedAt,
                        screenshotUrl: analysis.screenshotUrl || `/api/media/fallback-screenshot`,
                        hasAudio: !!analysis.audioSize,
                        quickSummary: {
                            verdict: aiSummary.verdict,
                            confidence: aiSummary.confidence,
                            aiPercentage: aiSummary.aiPercentage,
                            totalSegments: aiSummary.totalSegments,
                            hasErrors: !!aiSummary.error
                        }
                    };
                })
            );

            const response = {
                success: true,
                data: {
                    analyses: analysesWithSummary,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            };

            res.status(200).json(response);
            
        } catch (error) {
            console.error('Error fetching analyses:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }
}

export default new ResultController();