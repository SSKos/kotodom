import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },  // Заголовок
    text: { type: String, required: true },  // Основной текст
    annotations: { type: [String] },  // Врезы
    media: { type: [String] },  // Фотографии и видео
});

export const Article = mongoose.model('Article', articleSchema);