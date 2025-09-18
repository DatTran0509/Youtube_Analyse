import Analysis from '../models/Analysis.js';

const generateAISummary = (transcript) => {
    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
        return {
            verdict: 'NO_DATA',
            confidence: 'unknown',
            aiProbability: null,
            totalSegments: 0,
            aiSegments: 0,
            humanSegments: 0,
            mixedSegments: 0,
            error: 'No transcript data available'
        };
    }

    const validSegments = transcript.filter(segment => 
        segment && typeof segment.ai_probability === 'number'
    );

    if (validSegments.length === 0) {
        return {
            verdict: 'NO_ANALYSIS',
            confidence: 'unknown',
            aiProbability: null,
            totalSegments: transcript.length,
            aiSegments: 0,
            humanSegments: 0,
            mixedSegments: 0,
            error: 'No valid AI analysis found'
        };
    }

    const aiSegments = validSegments.filter(s => s.analysis === 'AI').length;
    const humanSegments = validSegments.filter(s => s.analysis === 'HUMAN').length;
    const mixedSegments = validSegments.filter(s => s.analysis === 'MIXED').length;
    
    const avgAiProbability = validSegments.reduce((sum, s) => sum + s.ai_probability, 0) / validSegments.length;

    let verdict, confidence;
    if (aiSegments > humanSegments && aiSegments > mixedSegments) {
        verdict = 'AI';
        confidence = aiSegments > validSegments.length * 0.6 ? 'high' : 'medium';
    } else if (humanSegments > aiSegments && humanSegments > mixedSegments) {
        verdict = 'HUMAN';
        confidence = humanSegments > validSegments.length * 0.6 ? 'high' : 'medium';
    } else {
        verdict = 'MIXED';
        confidence = 'medium';
    }

    return {
        verdict,
        confidence,
        aiProbability: Math.round(avgAiProbability * 100) / 100,
        totalSegments: validSegments.length,
        aiSegments,
        humanSegments,
        mixedSegments,
        error: null
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
                    screenshotUrl: analysis.screenshotUrl || `/api/media/fallback-screenshot`,
                    audioUrl: analysis.audioData ? `/api/media/audio/${analysis._id}` : null,
                    audioSize: analysis.audioSize || 0,
                    audioMimeType: analysis.audioMimeType || 'audio/wav',
                    screenshotCloudinaryId: analysis.screenshotCloudinaryId || null,
                    aiAnalysisSummary: generateAISummary(analysis.transcript || [])
                }
            };
            
            res.status(200).json(response);
            
        } catch (error) {
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
                    hasAudio: !!analysis.audioSize,
                    audioSize: analysis.audioSize || 0,
                    transcriptSegments: (analysis.transcript || []).length,
                    aiAnalysisSummary: aiSummary,
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
                .select('-audioData -transcript')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Analysis.countDocuments();

            const analysesWithSummary = await Promise.all(
                analyses.map(async (analysis) => {
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
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }
}

export default new ResultController();