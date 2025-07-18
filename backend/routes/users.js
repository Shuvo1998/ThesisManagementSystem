// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const auth = require('../middleware/auth'); // Import authentication middleware
const authorize = require('../middleware/authorize'); // Import authorization middleware

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin Only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Fetch all users except their passwords
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin Only)
router.put('/:id/role', auth, authorize(['admin']), async (req, res) => {
  const { role } = req.body;

  // Ensure the new role is either 'user' or 'admin'
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent an admin from demoting themselves
    if (req.user.id === req.params.id && role === 'user') {
      return res.status(400).json({ message: 'Admin cannot demote themselves.' });
    }

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;