import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
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

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;