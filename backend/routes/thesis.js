// backend/routes/thesis.js
const express = require('express');
const router = express.Router();
const thesisController = require('../controllers/thesisController');
const auth = require('../middleware/auth'); // Authentication middleware
const upload = require('../middleware/upload'); // File upload middleware (assuming it's defined and used for uploads)

// @route   GET /api/theses
// @desc    Get all approved theses (for public view)
// @access  Public
router.get('/', thesisController.getAllTheses); // <--- Add this line for fetching all approved theses

// @route   GET /api/theses/me
// @desc    Get theses uploaded by the logged-in user
// @access  Private (requires authentication)
router.get('/me', auth, thesisController.getMyTheses); // <--- Add this line for fetching user's own theses

// @route   POST /api/theses/upload
// @desc    Upload a new thesis (requires authentication and file upload)
// @access  Private
// Make sure you uncomment and use your actual 'upload' middleware here
router.post('/upload', auth, upload.single('pdfFile'), thesisController.uploadThesis); // <--- Ensure this is uncommented and correct

// @route   PUT /api/theses/:id
// @desc    Update a specific thesis by ID (requires authentication)
// @access  Private
router.put('/:id', auth, thesisController.updateThesis); // <--- Ensure this is uncommented and correct

// @route   GET /api/theses/semantic-search
// @desc    Perform semantic search on theses
// @access  Public (or Private, depending on your design)
router.get('/semantic-search', thesisController.semanticSearchTheses);


module.exports = router;