import express from 'express';
import mongoose from 'mongoose';
import { Animal } from './models/Animal.js';
import { Article } from './models/Article.js';
import { Content } from './models/Content.js';

const app = express();
const PORT = 5001;
const MONGO_URI = 'mongodb://mongodb:27017/kotoDB';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// CRUD для животных
app.post('/api/animals', async (req, res) => {
    const { name, admissionDate, age, gender, ...rest } = req.body;

    const latestAnimal = await Animal.findOne().sort({ createdAt: -1 });
    const nextId = latestAnimal ? String(parseInt(latestAnimal.id) + 1).padStart(4, '0') : '0001';

    const newAnimal = new Animal({ id: nextId, name, admissionDate, age, gender, ...rest });
    await newAnimal.save();
    res.status(201).json(newAnimal);
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

app.get('/api/animals', async (req, res) => {
    try {
        const animals = await Animal.find();  // Получаем всех животных из базы
        res.json(animals);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении данных о животных' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));