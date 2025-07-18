// backend/routes/thesis.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const path = require('path');
const Thesis = require('../models/Thesis');
const User = require('../models/User'); // To populate uploadedBy field
const auth = require('../middleware/auth'); // For protecting routes

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename: fieldname-timestamp.ext
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20 // 20 MB file size limit
  }
});

// @route   POST api/theses
// @desc    Upload a new thesis
// @access  Private (only logged-in users can upload)
router.post('/', auth, upload.single('thesisFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or file type not allowed (only PDF).' });
    }

    const { title, abstract, authors, department, keywords } = req.body;

    // Basic validation
    if (!title || !abstract || !authors || !department) {
      // If authors is an array, ensure it's not empty
      if (Array.isArray(authors) && authors.length === 0) {
        return res.status(400).json({ message: 'Please include all required fields: title, abstract, authors, department.' });
      }
      return res.status(400).json({ message: 'Please include all required fields: title, abstract, authors, department.' });
    }

    const newThesis = new Thesis({
      title,
      abstract,
      authors: Array.isArray(authors) ? authors : authors.split(',').map(s => s.trim()), // Handle comma-separated string or array
      department,
      uploadedBy: req.user.id, // User ID from auth middleware
      filePath: req.file.path, // Path where Multer saved the file
      fileMimeType: req.file.mimetype,
      keywords: Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map(s => s.trim()) : []), // Handle comma-separated string or array, or empty
    });

    const thesis = await newThesis.save();
    res.status(201).json({ message: 'Thesis uploaded successfully!', thesis });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) { // Duplicate key error (if unique fields were added and violated)
        return res.status(400).json({ message: 'Duplicate entry detected.' });
    }
    if (err.message === 'Only PDF files are allowed!') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/theses
// @desc    Get all theses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const theses = await Thesis.find().populate('uploadedBy', ['username', 'email']); // Populate uploader info
    res.json(theses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/theses/:id
// @desc    Get thesis by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id).populate('uploadedBy', ['username', 'email']);
    if (!thesis) {
      return res.status(404).json({ message: 'Thesis not found' });
    }
    res.json(thesis);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') { // Handle invalid ID format
        return res.status(404).json({ message: 'Thesis not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/theses/download/:id
// @desc    Download a thesis file
// @access  Public (or Private, depending on requirements)
router.get('/download/:id', async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id);
    if (!thesis) {
      return res.status(404).json({ message: 'Thesis not found' });
    }

    const filePath = path.join(__dirname, '..', thesis.filePath); // Construct full path
    res.download(filePath, thesis.title + path.extname(thesis.filePath), (err) => {
      if (err) {
        console.error('File download error:', err.message);
        return res.status(500).json({ message: 'Could not download the file.' });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// TODO: Add PUT (update) and DELETE routes later, potentially with admin/uploader roles checks

module.exports = router;