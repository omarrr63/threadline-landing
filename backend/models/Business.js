const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  website: String,
  logo: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  whatsappConfig: {
    businessAccountId: String,
    phoneNumberId: String,
    accessToken: String,
    displayName: String,
    phoneNumber: String,
    isConnected: { type: Boolean, default: false },
    connectedAt: Date
  },
  teamMembers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'agent', 'viewer'] },
    joinedAt: { type: Date, default: Date.now }
  }],
  features: {
    bulkMessaging: { type: Boolean, default: true },
    chatbot: { type: Boolean, default: true },
    teamInbox: { type: Boolean, default: true },
    aiAgent: { type: Boolean, default: false },
    numberMasking: { type: Boolean, default: true },
    webhooks: { type: Boolean, default: true },
    integrations: { type: Boolean, default: true }
  },
  plan: {
    type: String,
    enum: ['free', 'starter', 'professional', 'enterprise'],
    default: 'free'
  },
  messageLimit: {
    type: Number,
    default: 1000 // Free tier: 1000 messages/month
  },
  messageUsage: {
    type: Number,
    default: 0
  },
  billingCycle: {
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' }
  },
  settings: {
    timezone: { type: String, default: 'UTC' },
    autoReplyEnabled: Boolean,
    autoReplyMessage: String,
    supportHours: {
      mondayToFriday: { open: String, close: String },
      weekends: { open: String, close: String }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Business', businessSchema);
