const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Business = require('../models/Business');

const PLANS = {
  free: { price: 0, messages: 1000 },
  starter: { price: 2999, messages: 10000 },
  professional: { price: 9999, messages: 100000 },
  enterprise: { price: 29999, messages: 'unlimited' }
};

// Create Subscription
router.post('/subscribe', async (req, res, next) => {
  try {
    const { plan, paymentMethodId } = req.body;
    const business = await Business.findById(req.user.businessId);
    
    if (plan === 'free') {
      business.plan = 'free';
      business.messageLimit = PLANS.free.messages;
      await business.save();
      return res.json({ message: 'Free plan activated', plan: 'free' });
    }
    
    // Create Stripe customer and subscription
    const customer = await stripe.customers.create({
      email: req.user.email,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId }
    });
    
    // Create subscription (you'll need Stripe product IDs)
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: `price_${plan}` }] // Replace with actual Stripe price IDs
    });
    
    business.plan = plan;
    business.messageLimit = PLANS[plan].messages;
    business.billingCycle = {
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    };
    await business.save();
    
    res.json({ message: 'Subscription created', data: subscription });
  } catch (error) {
    next(error);
  }
});

// Get Current Plan
router.get('/plan', async (req, res, next) => {
  try {
    const business = await Business.findById(req.user.businessId);
    res.json({
      plan: business.plan,
      messageLimit: business.messageLimit,
      messageUsage: business.messageUsage,
      billingCycle: business.billingCycle
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
