const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User.model');

// @route   GET api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, preferredLanguage } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;