// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- Add this line
const path = require('path'); // For serving static files/uploads

// Import routes
const authRoutes = require('./routes/auth');
const thesisRoutes = require('./routes/thesis'); // Assuming you have this for your thesis routes
// ... other routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser for JSON
// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 204 // For preflight requests
}));
// Or for development, to allow all origins (less secure, but easier for testing)
// app.use(cors());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error(err));

// Serve static files (like uploaded PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/theses', thesisRoutes); // Your thesis routes are likely here
// ... other app.use for routes

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});