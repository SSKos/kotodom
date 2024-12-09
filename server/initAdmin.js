// server/initAdmin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {User} from './models/User.js'; // Модель пользователя

async function createAdminUser() {
    try {
        const MONGO_URI = 'mongodb://mongodb:27017/kotoDB';  // имя хоста "mongodb" соотв. сервису в docker-compose
        await mongoose.connect(MONGO_URI);
        const adminEmail = 'i@skavr.ru';
        const admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('Adm1ni$tr@toR', 10);
            await User.create({
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
            });
            console.log('Admin user created.');
        } else {
            console.log('Admin user already exists.');
        }
        mongoose.disconnect();
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

createAdminUser();