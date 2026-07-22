const express = require('express');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Business = require('../models/Business');

const webhookHandler = async (req, res) => {
  // Verify webhook token
  if (req.method === 'GET') {
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
      return res.send(challenge);
    }
    return res.sendStatus(403);
  }
  
  // Handle webhook events
  if (req.method === 'POST') {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const messages = change.value.messages || [];
            const contacts = change.value.contacts || [];
            const phoneNumberId = change.value.metadata.phone_number_id;
            
            // Find business by phone number ID
            const business = await Business.findOne({
              'whatsappConfig.phoneNumberId': phoneNumberId
            });
            
            if (!business) return res.sendStatus(200);
            
            for (const message of messages) {
              const contact = contacts[0];
              const from = message.from;
              
              // Create or update conversation
              let conversation = await Conversation.findOne({
                businessId: business._id,
                customerPhone: from
              });
              
              if (!conversation) {
                conversation = new Conversation({
                  businessId: business._id,
                  customerPhone: from,
                  customerName: contact.profile.name
                });
                await conversation.save();
              }
              
              // Save message
              const msg = new Message({
                businessId: business._id,
                conversationId: conversation._id,
                senderType: 'customer',
                senderPhone: from,
                senderName: contact.profile.name,
                messageType: message.type,
                content: { text: message.text?.body || '' },
                status: 'delivered',
                whatsappMessageId: message.id
              });
              await msg.save();
              
              conversation.messageCount += 1;
              conversation.lastMessageAt = new Date();
              await conversation.save();
            }
          }
        }
      }
    }
    
    res.sendStatus(200);
  }
};

module.exports = webhookHandler;
