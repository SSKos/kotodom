import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    filename: { type: String, required: true } // Имя файла
});


const animalSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },  // Дата создания записи
    admissionDate: { type: String },  // Дата поступления
    name: { type: String },  // Имя животного
    nameENG: { type: String },
    ageYears: { type: Number, default: 1 },  // Возраст в годах
    ageMonths: { type: Number, default: 0 },  // Возраст в месяцах
    gender: { type: String, enum: ['Мужской', 'Женский'], default: 'Мужской' },  // Гендер
    description: { type: String },  // Описание
    requiresTreatment: { type: Boolean, default: false },  // Нуждается в лечении
    treatmentDescription: { type: String },  // Описание лечения (если нужно)
    sterilized: { type: Boolean, default: false },  // Стерилизация
    urgentHelp: { type: Boolean, default: false },  // Срочно нужна помощь
    urgentHelpDescription: { type: String },  // Описание срочной помощи
    diet: { type: String },  // Особенности корма
    photos: [photoSchema],  // Хранение изображений
    videos: [String],  // Хранение видеофайлов
    publish: { type: Boolean, default: false },  // Флаг "Публиковать"
    adopted: { type: Boolean, default: false },  // Флаг "Обрел дом"
}, { timestamps: true });

export const Animal = mongoose.model('Animal', animalSchema);
export default Animal;