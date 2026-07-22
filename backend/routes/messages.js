const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Get Messages for Conversation
router.get('/conversation/:conversationId', async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      businessId: req.user.businessId
    }).sort({ createdAt: -1 }).limit(50);
    
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// Get All Conversations
router.get('/conversations', async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      businessId: req.user.businessId
    }).populate('assignedTo', 'firstName lastName').sort({ lastMessageAt: -1 });
    
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// Mark Message as Read
router.patch('/:messageId/read', async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { status: 'read', updatedAt: new Date() },
      { new: true }
    );
    
    res.json(message);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
