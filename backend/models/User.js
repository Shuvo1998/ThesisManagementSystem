// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // bcryptjs ইম্পোর্ট করুন

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'faculty', 'student'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to hash password before saving (প্রিসেভ হুক)
// এটি প্রতিটি সেভের আগে রান হবে
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) { // যদি পাসওয়ার্ড মডিফাই না হয়, তাহলে হ্যাশ করার দরকার নেই
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);