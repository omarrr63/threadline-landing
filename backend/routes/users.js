const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get Current User
router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update Profile
router.patch('/me', async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, avatar, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
