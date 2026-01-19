import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://10.2.0.137:3000',

];

const allowedOrigins = [
    'http://localhost:5173',
    'https://status-frontend-q9a3.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notes', noteRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
