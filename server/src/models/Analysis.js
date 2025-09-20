import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    // Thêm thông tin user
    userId: {
        type: String,
        required: true,
        index: true // Tạo index để query nhanh
    },
    userEmail: {
        type: String,
        required: false
    },
    userName: {
        type: String,
        required: false
    },
    
    youtubeUrl: {
        type: String,
        required: true,
    },
    videoTitle: {
        type: String,
        required: false, 
        default: 'Processing...'
    },
    // Cloudinary screenshot URL
    screenshotUrl: {
        type: String,
        required: false
    },
    screenshotCloudinaryId: {
        type: String,
        required: false
    },
    // Audio binary data in MongoDB
    audioData: {
        type: Buffer,
        required: false
    },
    audioMimeType: {
        type: String,
        required: false,
        default: 'audio/wav'
    },
    audioSize: {
        type: Number,
        required: false
    },
    transcript: {
        type: Array,
        required: false, 
        default: []
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

// Tạo compound index cho user và thời gian
analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;