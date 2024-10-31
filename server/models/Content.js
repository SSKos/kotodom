import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },  // Заголовок
    text: { type: String, required: true },  // Текст
    annotations: { type: [String] },  // Врезы
    media: { type: [String] },  // Фотографии и видео
});

export const Content = mongoose.model('Content', contentSchema);