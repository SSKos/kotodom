import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { Animal } from './models/Animal.js';
import { Article } from './models/Article.js';
import { Content } from './models/Content.js';

const app = express();
const PORT = 5001;
const MONGO_URI = 'mongodb://mongodb:27017/kotoDB';

// Настройка подключения к MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Лимиты на текстовые данные
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Настройка multer для загрузки файлов (память или диск)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Лимит файла в 10MB
});

// Маршрут для добавления нового животного с загрузкой файлов
app.post('/api/animals', upload.fields([{ name: 'photos' }, { name: 'videos' }]), async (req, res) => {
    try {
        const { name, admissionDate, age, gender, urgentHelp, urgentHelpDescription } = req.body;
        // Преобразуем каждое изображение и видео в Buffer для хранения
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
        res.status(201).json({ message: "Животное добавлено успешно", newAnimal });
    } catch (error) {
        console.error('Ошибка при сохранении животного:', error);
        res.status(500).json({ message: 'Ошибка при добавлении животного' });
    }
});

// Получение всех животных
app.get('/api/animals', async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении данных о животных' });
    }
});

// CRUD для статей
app.post('/api/articles', async (req, res) => {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.status(201).json(newArticle);
});

app.get('/api/articles', async (req, res) => {
    const articles = await Article.find();
    res.json(articles);
});

// CRUD для контента
app.post('/api/content', async (req, res) => {
    const newContent = new Content(req.body);
    await newContent.save();
    res.status(201).json(newContent);
});

app.get('/api/content', async (req, res) => {
    const content = await Content.find();
    res.json(content);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));