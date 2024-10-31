import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
    id: { type: String, required: true },  // Порядковый номер (0001, 0002...)
    createdAt: { type: Date, default: Date.now },  // Дата создания записи
    admissionDate: { type: String, required: true },  // Дата поступления
    name: { type: String, required: true },  // Имя животного
    age: { type: String, required: true },  // Возраст (лет и месяцев)
    gender: { type: String, enum: ['Мужской', 'Женский'], required: true },  // Гендер
    requiresTreatment: { type: Boolean, default: false },  // Нуждается в лечении
    treatmentDescription: { type: String },  // Описание лечения (если нужно)
    sterilized: { type: Boolean, default: false },  // Стерилизация
    urgentHelp: { type: Boolean, default: false },  // Срочно нужна помощь
    urgentHelpDescription: { type: String },  // Описание срочной помощи
    description: { type: String },  // Описание
    diet: { type: String },  // Особенности корма
    photos: [Buffer],  // или другой подходящий тип для хранения изображений
    videos: [Buffer],  // или другой подходящий тип для хранения видеофайлов
});

export const Animal = mongoose.model('Animal', animalSchema);