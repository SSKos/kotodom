// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import authRoutes from './routes/authRoutes.js';
import { PORT, MONGO_URI } from './config.js';

const app = express();

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api', authRoutes);

// Server listener
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));