const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const User = require('../models/User');

// Get Team Members
router.get('/members', async (req, res, next) => {
  try {
    const business = await Business.findById(req.user.businessId).populate('teamMembers.userId', 'firstName lastName email');
    res.json(business.teamMembers);
  } catch (error) {
    next(error);
  }
});

// Add Team Member
router.post('/members', async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const business = await Business.findById(req.user.businessId);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    business.teamMembers.push({
      userId: user._id,
      role
    });
    await business.save();
    
    res.json({ message: 'Team member added', data: business.teamMembers });
  } catch (error) {
    next(error);
  }
});

// Remove Team Member
router.delete('/members/:memberId', async (req, res, next) => {
  try {
    const business = await Business.findById(req.user.businessId);
    business.teamMembers = business.teamMembers.filter(m => m.userId.toString() !== req.params.memberId);
    await business.save();
    
    res.json({ message: 'Team member removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
