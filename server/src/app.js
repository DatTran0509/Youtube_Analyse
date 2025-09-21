// server/src/app.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { connectDB } from './utils/database.js';
import analysisRoutes from './routes/analyze.js';
import resultRoutes from './routes/result.js';
import mediaRoutes from './routes/media.js';
import userRoutes from './routes/user.js';
// Load environment variables FIRST
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
await connectDB();

// Routes
app.use('/api', analysisRoutes);
app.use('/api/result', resultRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/user', userRoutes);
// Health check endpoint
app.use('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    if (error.message.includes('Unauthenticated')) {
        return res.status(401).json({
            success: false,
            error: 'Authentication failed - invalid or missing token'
        });
    }
    
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
export default app;