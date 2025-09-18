import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './utils/database.js';
import analyzeRoutes from './routes/analyze.js';
import resultRoutes from './routes/result.js';
import mediaRoutes from './routes/media.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
await connectDB();

// Routes
app.use('/api', analyzeRoutes);
app.use('/api/result', resultRoutes);
app.use('/api/media', mediaRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});