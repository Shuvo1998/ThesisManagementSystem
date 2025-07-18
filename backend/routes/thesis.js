// backend/routes/thesis.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize'); // authorize middleware যোগ করুন
const Thesis = require('../models/Thesis');
const User = require('../models/User'); // ইউজারের ইমেইল ফেচ করার জন্য


// @route   GET /api/theses
// @desc    Get all approved theses for the dashboard (public view)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const theses = await Thesis.find({ status: 'approved' }).populate('user', ['email']);
    res.json(theses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   POST /api/theses
// @desc    আপলোড থিসিস
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('author', 'Author is required').not().isEmpty(),
      check('abstract', 'Abstract is required').not().isEmpty(),
      check('year', 'Year is required').isNumeric(),
      check('department', 'Department is required').not().isEmpty(),
      check('fileUrl', 'File URL is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newThesis = new Thesis({
        user: req.user.id, // আপলোডারের আইডি
        title: req.body.title,
        author: req.body.author,
        abstract: req.body.abstract,
        year: req.body.year,
        department: req.body.department,
        fileUrl: req.body.fileUrl,
        status: 'pending', // নতুন থিসিস বাই ডিফল্ট 'pending' থাকবে
      });

      const thesis = await newThesis.save();
      res.json(thesis);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/theses/me
// @desc    লগইন করা ইউজারের সকল থিসিস আনুন
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const theses = await Thesis.find({ user: req.user.id }).populate('user', ['email']); // আপলোডারের ইমেইল সহ
    res.json(theses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/theses/approved
// @desc    অনুমোদিত থিসিস আনুন (সবাই দেখতে পাবে)
// @access  Public
router.get('/approved', async (req, res) => {
  try {
    const theses = await Thesis.find({ status: 'approved' }).populate('user', ['email']);
    res.json(theses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/theses/all  <<< নতুন রুট: সকল থিসিস, শুধুমাত্র অ্যাডমিনদের জন্য
// @desc    সকল থিসিস আনুন (শুধুমাত্র অ্যাডমিনদের জন্য)
// @access  Private (Admin Only)
router.get('/all', auth, authorize(['admin']), async (req, res) => {
  try {
    const theses = await Thesis.find().populate('user', ['email']); // ইউজারের ইমেইল সহ সকল থিসিস আনুন
    res.json(theses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/theses/:id
// @desc    ID দিয়ে একটি থিসিস আনুন
// @access  Public (যদি অনুমোদিত হয়)
router.get('/:id', async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id).populate('user', ['email']);

    if (!thesis) {
      return res.status(404).json({ msg: 'Thesis not found' });
    }

    // যদি থিসিস অনুমোদিত না হয় এবং রিকোয়েস্টকারী অ্যাডমিন বা আপলোডার না হয়, তাহলে অ্যাক্সেস ডিনাই করুন
    // (এই অংশের জন্য auth এবং authorize middleware যুক্ত করতে হবে যদি এটি Private করতে চান)
    // For now, it fetches by ID if found, consider adding auth middleware for specific cases.
    res.json(thesis);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Thesis not found' });
    }
    res.status(500).send('Server Error');
  }
});

// backend/routes/thesis.js (relevant section)

// @route   PUT /api/theses/:id/status
// @desc    Update thesis status (Admin only)
// @access  Private (Admin Only)
router.put('/:id/status', auth, authorize(['admin']), async (req, res) => {
  const { status } = req.body;

  // Ensure the new status is one of the allowed values
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status specified.' });
  }

  try {
    // Find the thesis by ID and update its status
    const thesis = await Thesis.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status } }, // Use $set to update specific fields
      { new: true, runValidators: true } // Return the updated document, run validators on update
    );

    if (!thesis) {
      return res.status(404).json({ message: 'Thesis not found' });
    }

    res.json({ message: 'Thesis status updated successfully', thesis });
  } catch (err) {
    console.error(err.message);
    // Log the full error to see what specific validation failed if it still occurs
    // console.error(err); // This might give more detailed Mongoose validation info
    res.status(500).send('Server Error');
  }
});


// ... (also modify the DELETE route's delete method to be more robust)

// @route   DELETE /api/theses/:id
// @desc    Delete thesis (Admin only)
// @access  Private (Admin Only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const result = await Thesis.deleteOne({ _id: req.params.id }); // Using deleteOne for clarity

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Thesis not found' });
    }

    res.json({ message: 'Thesis removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Thesis not found' });
    }
    res.status(500).send('Server Error');
  }
});

// ... (rest of the file)

// @route   DELETE /api/theses/:id  <<< নতুন রুট: থিসিস ডিলিট করার জন্য
// @desc    থিসিস ডিলিট করুন (শুধুমাত্র অ্যাডমিনদের জন্য)
// @access  Private (Admin Only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id);

    if (!thesis) {
      return res.status(404).json({ message: 'Thesis not found' });
    }

    await Thesis.deleteOne({ _id: req.params.id }); // Mongoose 5.x এর জন্য remove() এর পরিবর্তে deleteOne()
    res.json({ message: 'Thesis removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Thesis not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;