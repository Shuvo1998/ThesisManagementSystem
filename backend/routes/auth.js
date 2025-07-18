// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User মডেল ইম্পোর্ট করুন
const auth = require('../middleware/auth'); // Auth মিডলওয়্যার (পরে তৈরি করব)

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // ইমেল বা ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে কিনা চেক করুন
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // নতুন ইউজার তৈরি করুন
    user = new User({
      username,
      email,
      password, // এটি model pre-save hook দ্বারা হ্যাশ হবে
      role: role || 'user', // যদি রোল না থাকে তবে ডিফল্ট 'user' হবে
    });

    await user.save();

    // JWT payload তৈরি করুন
    const payload = {
      user: {
        id: user.id,
        role: user.role, // রোলও payload এ যুক্ত করা হলো
      },
    };

    // JWT সাইন করুন
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // টোকেন ৫ ঘন্টার জন্য বৈধ
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, message: 'User registered successfully!' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // ইমেইল দিয়ে ইউজার খুঁজুন
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // পাসওয়ার্ড ম্যাচ করছে কিনা চেক করুন
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // JWT payload তৈরি করুন
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // JWT সাইন করুন
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, message: 'Logged in successfully!' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/user
// @desc    Get logged in user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // auth মিডলওয়্যার থেকে req.user.id আসে
    const user = await User.findById(req.user.id).select('-password'); // পাসওয়ার্ড ছাড়া ইউজার ডেটা আনুন
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;