const Razorpay = require('razorpay');
const crypto = require('crypto');

// Lazy initialize Razorpay
let razorpay = null;
const getRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('placeholder')) {
    try {
      razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    } catch (e) {
      console.warn('Razorpay initialization failed:', e.message);
    }
  }
  return razorpay;
};

// Lazy initialize Stripe
let stripe = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
    try {
      stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    } catch (e) {
      console.warn('Stripe initialization failed:', e.message);
    }
  }
  return stripe;
};

const Order = require('../models/Order');

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay is not configured. Please add API keys to .env'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      payment_capture: 1 // Auto-capture payment
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify Razorpay Payment
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed'
      });
    }

    // Update order with payment details
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'completed',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      orderStatus: 'confirmed'
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create Stripe Payment Intent
exports.createStripeIntent = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return res.status(400).json({
        success: false,
        message: 'Stripe is not configured. Please add API keys to .env'
      });
    }

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'usd',
      metadata: { orderId },
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify Stripe Payment
exports.verifyStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return res.status(400).json({
        success: false,
        message: 'Stripe is not configured. Please add API keys to .env'
      });
    }

    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order with payment details
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'completed',
        paymentId: paymentIntentId,
        orderStatus: 'confirmed'
      });

      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
