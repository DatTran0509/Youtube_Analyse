// server/src/controllers/analysisController.js
import Analysis from '../models/Analysis.js';
import { processYouTubeUrl } from '../services/youtubeService.js';
import { createOrUpdateUser, incrementAnalysisCount } from '../services/userService.js';

class AnalysisController {
    async createAnalysis(req, res) {
        try {
            const { url } = req.body;
            const userId = req.headers['x-user-id']; // Đổi từ req.auth?.userId


            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            if (!url) {
                return res.status(400).json({
                    success: false,
                    error: 'YouTube URL is required'
                });
            }

            // Tạo hoặc cập nhật thông tin user
            const user = await createOrUpdateUser(userId);
            
            const analysisData = {
                youtubeUrl: url,
                userId: userId,
                userEmail: user.email,
                userName: `${user.firstName} ${user.lastName}`.trim() || user.email,
                status: 'processing'
            };

            const analysis = new Analysis(analysisData);
            const savedAnalysis = await analysis.save();

            
            // Tăng số lượng analysis của user
            await incrementAnalysisCount(userId);

            // QUAN TRỌNG: Xử lý video trong background với userId
            processYouTubeUrl(url, savedAnalysis._id, userId)
                .catch(error => {
                    console.error('Background processing error:', error);
                    // Cập nhật status thành failed nếu có lỗi
                    Analysis.findByIdAndUpdate(savedAnalysis._id, { 
                        status: 'failed',
                        completedAt: new Date()
                    }).catch(updateError => {
                        console.error('Failed to update analysis status:', updateError);
                    });
                });

            res.status(201).json({
                success: true,
                data: {
                    id: savedAnalysis._id,
                    status: savedAnalysis.status,
                    videoTitle: savedAnalysis.videoTitle,
                    message: 'Analysis started successfully'
                }
            });

        } catch (error) {
            console.error('Create analysis error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to start analysis'
            });
        }
    }

    async getUserAnalyses(req, res) {
        try {
            const userId = req.headers['x-user-id']; // Đổi từ req.auth?.userId
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            const analyses = await Analysis.find({ userId })
                .select('-audioData')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Analysis.countDocuments({ userId });

            res.status(200).json({
                success: true,
                data: {
                    analyses,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get user analyses error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get analyses'
            });
        }
    }
}

export default new AnalysisController();