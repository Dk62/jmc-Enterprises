const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Create Razorpay order
router.post('/razorpay/create-order', authMiddleware, paymentController.createRazorpayOrder);

// Verify Razorpay payment
router.post('/razorpay/verify-payment', authMiddleware, paymentController.verifyRazorpayPayment);

// Create Stripe payment intent
router.post('/stripe/create-intent', authMiddleware, paymentController.createStripeIntent);

// Verify Stripe payment
router.post('/stripe/verify-payment', authMiddleware, paymentController.verifyStripePayment);

module.exports = router;
