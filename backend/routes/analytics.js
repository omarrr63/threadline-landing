const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Business = require('../models/Business');

// Get Dashboard Stats
router.get('/stats', async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const totalMessages = await Message.countDocuments({
      businessId,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const totalConversations = await Conversation.countDocuments({
      businessId,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const openConversations = await Conversation.countDocuments({
      businessId,
      status: 'open'
    });
    
    const business = await Business.findById(businessId);
    const messageUsagePercent = (business.messageUsage / business.messageLimit) * 100;
    
    res.json({
      totalMessages,
      totalConversations,
      openConversations,
      messageUsage: business.messageUsage,
      messageLimit: business.messageLimit,
      messageUsagePercent: Math.round(messageUsagePercent),
      plan: business.plan
    });
  } catch (error) {
    next(error);
  }
});

// Get Message Analytics
router.get('/messages', async (req, res, next) => {
  try {
    const businessId = req.user.businessId;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const messagesByStatus = await Message.aggregate([
      {
        $match: {
          businessId: require('mongoose').Types.ObjectId(businessId),
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(messagesByStatus);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
