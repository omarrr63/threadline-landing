const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// Save Integration Credentials
router.post('/google-sheets', async (req, res, next) => {
  try {
    const { sheetId, apiKey } = req.body;
    const business = await Business.findById(req.user.businessId);
    
    business.integrations = business.integrations || {};
    business.integrations.googleSheets = {
      sheetId,
      apiKey,
      enabled: true
    };
    await business.save();
    
    res.json({ message: 'Google Sheets connected' });
  } catch (error) {
    next(error);
  }
});

// Save Zapier Webhook
router.post('/zapier', async (req, res, next) => {
  try {
    const { webhookUrl } = req.body;
    const business = await Business.findById(req.user.businessId);
    
    business.integrations = business.integrations || {};
    business.integrations.zapier = {
      webhookUrl,
      enabled: true
    };
    await business.save();
    
    res.json({ message: 'Zapier connected' });
  } catch (error) {
    next(error);
  }
});

// Save Make Webhook
router.post('/make', async (req, res, next) => {
  try {
    const { webhookUrl } = req.body;
    const business = await Business.findById(req.user.businessId);
    
    business.integrations = business.integrations || {};
    business.integrations.make = {
      webhookUrl,
      enabled: true
    };
    await business.save();
    
    res.json({ message: 'Make connected' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
