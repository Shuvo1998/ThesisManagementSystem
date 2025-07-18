// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Add path module for serving static files

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <--- এই লাইনটি যোগ করুন

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// Define a simple root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/theses', require('./routes/thesis')); // <<-- এই লাইনটি যোগ করুন
// TODO: Other routes will be added here

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));