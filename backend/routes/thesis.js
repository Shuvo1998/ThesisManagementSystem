// backend/routes/thesis.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Thesis = require('../models/Thesis');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); // <<-- এই লাইনটি যোগ করুন

// ... (Multer setup and existing POST/GET routes) ...
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

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
router.post('/', auth, upload.single('thesisFile'), async (req, res) => { // <<< ENSURE THIS ROUTE IS HERE AND CORRECT
  try {
    if (!req.file) {
      // This part handles if Multer rejected the file (e.g., not PDF or too large)
      return res.status(400).json({ message: 'No file uploaded or file type not allowed (only PDF). Max 20MB.' });
    }

    const { title, abstract, authors, department, keywords } = req.body;

    // Basic validation
    if (!title || !abstract || !authors || !department) {
      return res.status(400).json({ message: 'Please include all required fields: title, abstract, authors, department.' });
    }
    if (Array.isArray(authors) && authors.length === 0) { // If authors came as an empty array
        return res.status(400).json({ message: 'Authors field cannot be empty.' });
    }

    const newThesis = new Thesis({
      title,
      abstract,
      authors: Array.isArray(authors) ? authors : authors.split(',').map(s => s.trim()),
      department,
      uploadedBy: req.user.id, // User ID from auth middleware
      filePath: req.file.path, // Path where Multer saved the file
      fileMimeType: req.file.mimetype,
      keywords: Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map(s => s.trim()) : []),
    });

    const thesis = await newThesis.save();
    res.status(201).json({ message: 'Thesis uploaded successfully!', thesis });
  } catch (err) {
    console.error(err.message);
    if (err.message === 'Only PDF files are allowed!') { // Multer error during fileFilter
        return res.status(400).json({ message: err.message });
    }
    // Handle other errors, e.g., if database save fails
    res.status(500).send('Server Error');
  }
});
router.get('/', async (req, res) => { // এই রুটটি আপডেট করুন
  try {
    const { search, department, author, status, uploadedBy } = req.query; // কোয়েরি প্যারামিটারগুলো গ্রহণ করুন
    let query = {};

    // Search by title, abstract, keywords, or authors
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      query.$or = [
        { title: searchRegex },
        { abstract: searchRegex },
        { keywords: searchRegex },
        { authors: searchRegex },
      ];
    }

    // Filter by department
    if (department) {
      query.department = new RegExp(department, 'i');
    }

    // Filter by author (if 'author' query param is explicitly for author field)
    if (author) {
      query.authors = new RegExp(author, 'i');
    }

    // Filter by status (for public viewing, might only show 'approved')
    // For now, public users can see 'pending' too, but you might change this later
    if (status && ['pending', 'approved', 'rejected'].includes(status.toLowerCase())) {
        query.status = status.toLowerCase();
    } else {
        // Default: only show approved theses to public if no status is specified,
        // or show all for simplicity. Let's show all for now and filter on frontend later.
        // query.status = 'approved'; // Uncomment this line if you only want approved theses for public
    }

    // Filter by uploadedBy user ID (e.g., to see theses uploaded by a specific user)
    if (uploadedBy) {
        // Ensure uploadedBy is a valid ObjectId if you plan to filter by user ID
        // For simplicity now, we'll assume it's directly passed and find
        const user = await User.findOne({ username: new RegExp(uploadedBy, 'i') });
        if (user) {
            query.uploadedBy = user._id;
        } else {
            // If user not found, no theses match, so return empty
            return res.json([]);
        }
    }


    const theses = await Thesis.find(query)
      .populate('uploadedBy', ['username', 'email']) // আপলোডকারীর ইউজারনেম এবং ইমেল পপুলেট করুন
      .sort({ submissionDate: -1 }); // নতুন থেকে পুরানো ক্রম অনুসারে সাজান

    res.json(theses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/theses/:id
// @desc    Update a thesis (by uploader or admin)
// @access  Private (Uploader or Admin)
router.put('/:id', auth, async (req, res) => {
  const { title, abstract, authors, department, keywords, status } = req.body;

  // Build thesis object
  const thesisFields = {};
  if (title) thesisFields.title = title;
  if (abstract) thesisFields.abstract = abstract;
  if (authors) thesisFields.authors = Array.isArray(authors) ? authors : authors.split(',').map(s => s.trim());
  if (department) thesisFields.department = department;
  if (keywords) thesisFields.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(s => s.trim());
  // Status can only be changed by admin
  if (status && (req.user.role === 'admin')) { // Check for admin role
    thesisFields.status = status;
  }

  try {
    let thesis = await Thesis.findById(req.params.id);

    if (!thesis) {
      return res.status(404).json({ message: 'Thesis not found' });
    }

    // Check user: only uploader or admin can update
    const user = await User.findById(req.user.id);
    if (thesis.uploadedBy.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this thesis' });
    }

    // If a new file is uploaded, this logic would need to be expanded with Multer
    // For now, this PUT only updates text fields. File replacement is more complex.

    thesis = await Thesis.findByIdAndUpdate(
      req.params.id,
      { $set: thesisFields },
      { new: true } // Return the updated document
    );

    res.json({ message: 'Thesis updated successfully!', thesis });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Thesis not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route   DELETE api/theses/:id
// @desc    Delete a thesis (by uploader or admin)
// @access  Private (Uploader or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id);

    if (!thesis) {
      return res.status(404).json({ message: 'Thesis not found' });
    }

    // Check user: only uploader or admin can delete
    const user = await User.findById(req.user.id);
    if (thesis.uploadedBy.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this thesis' });
    }

    // Optional: Delete the physical file from the 'uploads' folder
    // This requires 'fs' module
    // const fs = require('fs');
    // fs.unlink(thesis.filePath, (err) => {
    //   if (err) console.error('Failed to delete file from disk:', err);
    // });

    await Thesis.deleteOne({ _id: req.params.id });

    res.json({ message: 'Thesis removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Thesis not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route   GET api/theses/admin/all-theses
// @desc    Get all theses for admin (potentially with more details/filters)
// @access  Private (Admin only)
router.get('/admin/all-theses', auth, adminAuth, async (req, res) => {
    try {
        const theses = await Thesis.find().populate('uploadedBy', ['username', 'email', 'role']);
        res.json(theses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;