// Import necessary modules
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import animalsRoutes from './routes/animalsRoutes.js';
import authRouter from './routes/authRoutes.js'; // Предположим, что маршруты аутентификации находятся здесь


const app = express();
// Configure CORS
const whitelist = ['http://koto-dom.ru', 'http://localhost:8080', 'http://localhost'] // Замените на ваши домены

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // !origin для запросов с мобильных приложений или postman
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));
// const __filename = fileURLToPath(import.meta.url);


// const __dirname = dirname(__filename);
const PORT = process.env.PORT || 5001;
const MONGO_URI = 'mongodb://mongodb:27017/kotoDB';


// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up middleware for JSON and URL encoding
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve static files for uploaded images
app.use('/assets/img/cats', express.static(path.join(process.cwd(), 'client/src/assets/img/cats')));


// Use animals routes from animalsRoutes.js
app.use('/api', animalsRoutes);

app.use('/api', authRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));