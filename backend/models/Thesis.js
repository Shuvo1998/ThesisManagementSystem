// backend/models/Thesis.js
const mongoose = require('mongoose');

const ThesisSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    abstract: { type: String, required: true },
    supervisor: { type: String, required: true },
    department: { type: String, required: true },
    university: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    pdfPath: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    // *** এই লাইনটি যোগ করুন ***
    user: { // এটি থিসিসটি কোন ইউজার আপলোড করেছে তার আইডি
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 'User' মডেলকে রেফার করছে
        required: true // একটি থিসিস আপলোড করার জন্য ইউজার আইডি আবশ্যক
    },

    // নতুন যুক্ত করা ফিল্ড
    embedding: {
        type: [Number], // এটি একটি অ্যারে অফ নাম্বারস হবে
        required: false, // এমবেডিং বাধ্যতামূলক না হলেও, এটি থাকলে সেমান্টিক সার্চের জন্য ভালো
        index: true // কোয়েরি দ্রুত করার জন্য ইনডেক্সিং করা যেতে পারে
    },
    // অন্যান্য ফিল্ড...
}, { timestamps: true });

module.exports = mongoose.model('Thesis', ThesisSchema);