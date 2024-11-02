import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);