// server/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';
import {EMAIL_PASS, EMAIL_USER, JWT_SECRET} from '../config.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    }
});

export async function registerUser(req, res) {
    try {
        const { username, email } = req.body;
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: 'Your Account Password',
            text: `Welcome! Your password is ${password}. Please log in and change it immediately.`
        });

        res.status(201).json({ message: 'User registered. Password sent via email.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration error' });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid login credentials' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);  // Логирование ошибок
        res.status(500).json({ message: 'Login error' });
    }
}