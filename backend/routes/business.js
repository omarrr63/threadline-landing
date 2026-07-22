const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// Get Business
router.get('/', async (req, res, next) => {
  try {
    const business = await Business.findById(req.user.businessId)
      .populate('ownerId', 'firstName lastName email')
      .populate('teamMembers.userId', 'firstName lastName email');
    
    res.json(business);
  } catch (error) {
    next(error);
  }
});

// Update Business
router.patch('/', async (req, res, next) => {
  try {
    const { name, description, website, logo, settings } = req.body;
    const business = await Business.findByIdAndUpdate(
      req.user.businessId,
      { name, description, website, logo, settings, updatedAt: new Date() },
      { new: true }
    );
    
    res.json(business);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
