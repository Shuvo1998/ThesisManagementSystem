// backend/models/Thesis.js
const mongoose = require('mongoose');

const ThesisSchema = mongoose.Schema({
  user: { // <<< Add this field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // This references the 'user' model
    required: true // A thesis must be associated with a user
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  fileUrl: { // Assuming this will store the URL to the uploaded file
    type: String,
    required: true,
  },
  status: { // New field for approval status
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('thesis', ThesisSchema);