const mongoose = require('mongoose');

const chatbotFlowSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  nodes: [{
    id: String,
    type: { type: String, enum: ['message', 'question', 'action', 'handoff'] },
    content: {
      text: String,
      options: [{ label: String, nextNodeId: String }],
      aiPrompt: String,
      actionType: String // handoff, webhook, etc
    },
    condition: String
  }],
  startNode: String,
  isActive: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('ChatbotFlow', chatbotFlowSchema);
