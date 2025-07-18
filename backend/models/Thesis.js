// backend/models/Thesis.js
const mongoose = require('mongoose');

const ThesisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  authors: [
    {
      type: String, // Array of author names
      required: true,
      trim: true,
    },
  ],
  supervisor: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model (supervisor role)
    ref: 'User',
    required: false, // Will be required if supervisor feature is fully implemented
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model (who uploaded it)
    ref: 'User',
    required: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  filePath: {
    type: String, // Path to the uploaded PDF file
    required: true,
  },
  fileMimeType: { // To store the type of file, e.g., 'application/pdf'
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], // For admin approval workflow
    default: 'pending',
  },
  keywords: [
    {
      type: String,
      trim: true,
    },
  ],
  // You can add more fields as needed, e.g., year, program, etc.
});

module.exports = mongoose.model('Thesis', ThesisSchema);