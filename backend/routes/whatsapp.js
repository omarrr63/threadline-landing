const express = require('express');
const router = express.Router();
const axios = require('axios');
const Business = require('../models/Business');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Connect WhatsApp Business Account
router.post('/connect', async (req, res, next) => {
  try {
    const { businessAccountId, phoneNumberId, accessToken } = req.body;
    const businessId = req.user.businessId;
    
    // Verify credentials with WhatsApp API
    const response = await axios.get(
      `${process.env.WHATSAPP_API_URL}/${phoneNumberId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    
    if (response.status === 200) {
      const business = await Business.findById(businessId);
      business.whatsappConfig = {
        businessAccountId,
        phoneNumberId,
        accessToken,
        displayName: response.data.display_name,
        phoneNumber: response.data.phone_number,
        isConnected: true,
        connectedAt: new Date()
      };
      await business.save();
      
      res.json({ message: 'WhatsApp connected successfully', data: business.whatsappConfig });
    }
  } catch (error) {
    next(error);
  }
});

// Send Message
router.post('/send-message', async (req, res, next) => {
  try {
    const { to, message, messageType = 'text' } = req.body;
    const business = await Business.findById(req.user.businessId);
    
    if (!business.whatsappConfig.isConnected) {
      return res.status(400).json({ error: 'WhatsApp not connected' });
    }
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: messageType,
      [messageType]: { body: message }
    };
    
    const response = await axios.post(
      `${process.env.WHATSAPP_API_URL}/${business.whatsappConfig.phoneNumberId}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${business.whatsappConfig.accessToken}` } }
    );
    
    // Save message to database
    const msg = new Message({
      businessId: business._id,
      senderType: 'agent',
      senderPhone: business.whatsappConfig.phoneNumber,
      recipientPhone: to,
      messageType,
      content: { text: message },
      status: 'sent',
      whatsappMessageId: response.data.messages[0].id
    });
    await msg.save();
    
    res.json({ message: 'Message sent', data: msg });
  } catch (error) {
    next(error);
  }
});

// Send Bulk Messages
router.post('/send-bulk', async (req, res, next) => {
  try {
    const { recipients, message, templateName } = req.body;
    const business = await Business.findById(req.user.businessId);
    
    const results = [];
    for (const phone of recipients) {
      try {
        const payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phone,
          type: 'template',
          template: { name: templateName || 'hello_world' }
        };
        
        const response = await axios.post(
          `${process.env.WHATSAPP_API_URL}/${business.whatsappConfig.phoneNumberId}/messages`,
          payload,
          { headers: { Authorization: `Bearer ${business.whatsappConfig.accessToken}` } }
        );
        
        results.push({ phone, status: 'sent', messageId: response.data.messages[0].id });
      } catch (error) {
        results.push({ phone, status: 'failed', error: error.message });
      }
    }
    
    res.json({ message: 'Bulk messages processed', data: results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
