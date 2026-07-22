const express = require('express');
const router = express.Router();
const ChatbotFlow = require('../models/ChatbotFlow');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// Create Chatbot Flow
router.post('/flows', async (req, res, next) => {
  try {
    const { name, description, nodes, startNode } = req.body;
    
    const flow = new ChatbotFlow({
      businessId: req.user.businessId,
      name,
      description,
      nodes,
      startNode
    });
    await flow.save();
    
    res.status(201).json(flow);
  } catch (error) {
    next(error);
  }
});

// Get Chatbot Flows
router.get('/flows', async (req, res, next) => {
  try {
    const flows = await ChatbotFlow.find({ businessId: req.user.businessId });
    res.json(flows);
  } catch (error) {
    next(error);
  }
});

// AI Agent Response
router.post('/ai-response', async (req, res, next) => {
  try {
    const { message, conversationContext } = req.body;
    
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful WhatsApp business support agent. Be concise and friendly.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    });
    
    const aiMessage = response.data.choices[0].message.content;
    
    res.json({ response: aiMessage });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
