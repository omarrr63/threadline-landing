const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  senderType: {
    type: String,
    enum: ['customer', 'agent', 'bot'],
    required: true
  },
  senderName: String,
  senderPhone: String,
  senderMasked: String, // Masked phone number for agents
  recipientPhone: String,
  messageType: {
    type: String,
    enum: ['text', 'image', 'document', 'audio', 'video', 'template'],
    default: 'text'
  },
  content: {
    text: String,
    mediaUrl: String,
    templateName: String,
    templateParams: [String]
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  whatsappMessageId: String,
  metadata: {
    ipAddress: String,
    userAgent: String,
    campaignId: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Message', messageSchema);
