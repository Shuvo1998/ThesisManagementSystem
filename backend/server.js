// backend/server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS for all origins (for development)

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
connectDB();

// Define a simple root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// TODO: Define API routes here (e.g., app.use('/api/auth', require('./routes/auth')));
// (এই লাইনটি পরে আমরা app.use('/api/auth', require('./routes/auth')); দিয়ে পরিবর্তন করব)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));