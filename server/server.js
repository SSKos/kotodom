import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { Animal } from './models/Animal.js';
import { Article } from './models/Article.js';
import { Content } from './models/Content.js';
import { User } from './models/User.js';
import { authenticateToken, authorizeAdmin } from './middleware/auth.js';

const app = express();
const PORT = 5001;
const MONGO_URI = 'mongodb://mongodb:27017/kotoDB';
const JWT_SECRET = 'your_secret_key_here';

// MongoDB connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
    createDefaultUser();
}).catch(err => console.error('MongoDB connection error:', err));

// Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// JSON and URL-encoded limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Default admin user creation
async function createDefaultUser() {
    const existingUser = await User.findOne({ username: 'admini' });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const defaultUser = new User({
            username: 'admini',
            email: 'i@skavr.ru',
            password: hashedPassword,
            role: 'admin',
        });
        await defaultUser.save();
        console.log('Default admin user created: admini');
    } else {
        console.log('Default admini user already exists.');
    }
}

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'k3968575@gmail.com',
        pass: 'wykCu4-huvsib-mobmet'
    }
});

// Helper to send email with generated password
async function sendPasswordEmail(email, password) {
    const mailOptions = {
        from: 'k3968575@gmail.com',
        to: email,
        subject: 'Your Account Password',
        text: `Welcome! Your password is ${password}. Please log in and change it immediately.`
    };
    await transporter.sendMail(mailOptions);
}

// User registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const password = Math.random().toString(36).slice(-8);  // Generate a random password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        await sendPasswordEmail(email, password);

        res.status(201).json({ message: 'User registered. Password sent via email.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid login credentials' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login error' });
    }
});

// Admin-only protected route
app.get('/api/admin', authenticateToken, authorizeAdmin, (req, res) => {
    res.json({ message: 'Welcome to the admin area!' });
});

// Animal upload with files
app.post('/api/animals', upload.fields([{ name: 'photos' }, { name: 'videos' }]), async (req, res) => {
    try {
        const { name, admissionDate, age, gender, urgentHelp, urgentHelpDescription } = req.body;
        const photoBuffers = req.files['photos'] ? req.files['photos'].map(file => file.buffer) : [];
        const videoBuffers = req.files['videos'] ? req.files['videos'].map(file => file.buffer) : [];

        const latestAnimal = await Animal.findOne().sort({ createdAt: -1 });
        const nextId = latestAnimal ? String(parseInt(latestAnimal.id) + 1).padStart(4, '0') : '0001';

        const newAnimal = new Animal({
            id: nextId,
            name,
            admissionDate,
            age,
            gender,
            urgentHelp,
            urgentHelpDescription,
            photos: photoBuffers,
            videos: videoBuffers,
        });

        await newAnimal.save();
        res.status(201).json({ message: 'Animal successfully added', newAnimal });
    } catch (error) {
        console.error('Error saving animal:', error);
        res.status(500).json({ message: 'Error adding animal' });
    }
});

// Для получения списка пользователей
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username email role'); // Указываем, какие поля возвращать
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении списка пользователей' });
    }
});

// Для получения списка котов
app.get('/api/cats', async (req, res) => {
    try {
        const cats = await Animal.find(); // Убедитесь, что у вас есть модель Animal
        res.json(cats);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении списка котов' });
    }
});

// Server listener
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));