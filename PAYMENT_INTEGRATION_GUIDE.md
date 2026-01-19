# Payment Gateway Integration Guide

## Overview

This document provides a comprehensive guide to integrate payment gateways (Razorpay, Stripe) with UPI support into your JMC Enterprises e-commerce platform.

## Supported Payment Methods

### 1. **Razorpay (Primary - India)**
- ✅ UPI Payments (PhonePe, Google Pay, BHIM, etc.)
- ✅ Credit/Debit Cards
- ✅ Net Banking
- ✅ Digital Wallets (Paytm, Amazon Pay, etc.)
- Currency: ₹ (Indian Rupees)
- Website: https://razorpay.com

### 2. **Stripe (Secondary - International)**
- ✅ Credit/Debit Cards (Visa, Mastercard, Amex)
- ✅ Digital Wallets (Google Pay, Apple Pay)
- Currency: USD, EUR, GBP, etc.
- Website: https://stripe.com

### 3. **Bank Transfer (Manual)**
- ✅ Direct bank transfer with reference
- Manual verification required
- Useful for large orders

---

## Setup Instructions

### Step 1: Get API Keys

#### Razorpay Keys:
1. Go to https://dashboard.razorpay.com
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Copy your **Key ID** and **Key Secret**
5. For testing, use **Test Mode** keys first

**Test UPI Numbers for Testing:**
```
9123456789 (Success)
9000000000 (Failure)
```

#### Stripe Keys:
1. Go to https://dashboard.stripe.com
2. Sign up or log in
3. Navigate to Developers → API Keys
4. Copy **Publishable Key** and **Secret Key**
5. Use **Test Mode** for development

**Test Card Numbers for Testing:**
```
4242 4242 4242 4242 (Visa - Success)
5555 5555 5555 4444 (Mastercard - Success)
4000 0000 0000 9995 (Visa - Requires authentication)
```

### Step 2: Update Environment Variables

#### Backend (.env):
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_razorpay_secret_key

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

#### Frontend (.env):
```env
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

### Step 3: Install Dependencies

#### Backend:
```bash
npm install razorpay stripe
```

#### Frontend:
```bash
npm install @stripe/react-stripe-js @stripe/js
```

---

## Implementation Details

### Backend Architecture

#### Payment Routes (`backend/src/routes/payment.routes.js`)
```javascript
// Razorpay
POST /api/payments/razorpay/create-order
POST /api/payments/razorpay/verify-payment

// Stripe
POST /api/payments/stripe/create-intent
POST /api/payments/stripe/verify-payment
```

#### Payment Controller (`backend/src/controllers/paymentController.js`)

**Razorpay Functions:**
- `createRazorpayOrder()` - Creates order in Razorpay with amount in paise (₹ × 100)
- `verifyRazorpayPayment()` - Verifies payment using HMAC-SHA256 signature
- Handles payment status update in database

**Stripe Functions:**
- `createStripeIntent()` - Creates payment intent for card payments
- `verifyStripePayment()` - Verifies payment completion
- Supports 3D Secure authentication

### Frontend Components

#### RazorpayPayment Component (`frontend/src/components/RazorpayPayment.jsx`)
```jsx
<RazorpayPayment
  orderId={orderId}
  amount={amount}
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>
```

**Features:**
- Loads Razorpay script dynamically
- Supports UPI, Cards, Wallets
- Handles signature verification
- Shows loading state during payment

#### StripePayment Component (`frontend/src/components/StripePayment.jsx`)
```jsx
<StripePayment
  orderId={orderId}
  amount={amount}
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>
```

**Features:**
- Card element with real-time validation
- Supports digital wallets
- 3D Secure compatible
- Error handling

### CheckoutPage Flow

```
1. User fills shipping address
2. Selects payment method (Razorpay/Stripe/Bank)
3. Submits form → Order created in DB
4. Payment gateway component loads
5. User completes payment
6. Backend verifies payment
7. Order status updated
8. User redirected to account page
```

---

## Testing Payment Flows

### Razorpay UPI Testing

1. Select Razorpay as payment method
2. Click "Pay Now"
3. In Razorpay modal, select UPI option
4. Choose bank/app (BHIM, Google Pay, etc.)
5. Enter test UPI ID or use default
6. Complete payment

**Test UPI Flow:**
```
✓ UPI Modal opens
✓ Test payment processes
✓ Backend verifies signature
✓ Order status updates to "confirmed"
```

### Stripe Card Testing

1. Select Stripe as payment method
2. Enter test card: 4242 4242 4242 4242
3. Any future expiry date (e.g., 12/25)
4. Any 3-digit CVC
5. Complete payment

**Test Card Flow:**
```
✓ Card element loads
✓ Payment intent created
✓ Test charge processes
✓ Order status updates to "confirmed"
```

### Bank Transfer Testing

1. Select Bank Transfer
2. View bank details and reference number
3. Click "I've Transferred the Funds"
4. Order status set to "pending_verification"
5. Admin manually verifies transfer

---

## Database Schema Updates

### Order Model

Ensure your Order model includes:

```javascript
{
  // ... existing fields
  
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'bank_transfer'],
    required: true
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paymentId: String,
  razorpayOrderId: String,
  stripePaymentIntentId: String,
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}
```

---

## Security Considerations

### 1. **Server-Side Verification (CRITICAL)**
- ✅ Always verify payments on backend
- ✅ Never trust frontend payment status
- ✅ Validate HMAC signatures (Razorpay)
- ✅ Check payment intent status (Stripe)

### 2. **API Key Management**
- ✅ Use environment variables (never hardcode)
- ✅ Keep secret keys secure on backend only
- ✅ Use test keys for development
- ✅ Rotate keys regularly

### 3. **JWT Authentication**
- All payment endpoints require JWT token
- Payment routes include `auth` middleware
- Verifies user is authenticated before processing

### 4. **HTTPS Requirement**
- Always use HTTPS in production
- Razorpay and Stripe require secure connections
- PCI-DSS compliance necessary

### 5. **Amount Validation**
```javascript
// Backend validation
if (orderAmount !== cartTotal) {
  throw new Error('Amount mismatch - possible fraud');
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Razorpay not loaded"
**Solution:** Check if script loaded successfully
```javascript
if (!window.Razorpay) {
  console.error('Razorpay script failed to load');
}
```

#### 2. "Payment signature verification failed"
**Causes:**
- Signature key mismatch
- Order ID incorrect
- Amount mismatch (not converted to paise)

**Solution:**
```javascript
// Ensure amount is in paise for Razorpay
amount_in_rupees * 100 = amount_in_paise
```

#### 3. "Stripe card element not appearing"
**Solution:** Ensure Elements provider wraps component
```jsx
<Elements stripe={stripePromise}>
  <StripePaymentContent />
</Elements>
```

#### 4. "CORS error when calling payment APIs"
**Solution:** Update backend CORS configuration
```javascript
// backend/src/index.js
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

---

## Webhook Integration (Optional)

For production, set up webhooks to handle async events:

### Razorpay Webhooks
```
POST /api/webhooks/razorpay
```
Events: `payment.authorized`, `payment.failed`, `payment.captured`

### Stripe Webhooks
```
POST /api/webhooks/stripe
```
Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

**Example Webhook Endpoint:**
```javascript
router.post('/razorpay', (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  
  // Verify signature and update order status
});
```

---

## Moving to Production

### Checklist:

- [ ] Update all environment variables with live keys
- [ ] Test with live cards/UPI
- [ ] Implement webhook handlers
- [ ] Set up error logging and monitoring
- [ ] Implement refund handling
- [ ] Update privacy policy with payment info
- [ ] Test on all devices/browsers
- [ ] Set up payment analytics dashboard
- [ ] Configure email notifications
- [ ] Test edge cases (network failures, timeouts)

### Environment Variable Updates:

```env
# Switch to live keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret

STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx

# Update CORS for production domain
CORS_ORIGIN=https://yourdomain.com
```

---

## API Response Examples

### Razorpay Create Order Response
```json
{
  "razorpayOrderId": "order_KHmgvKUnt3Bfm8",
  "amount": 50000,
  "currency": "INR",
  "message": "Order created successfully"
}
```

### Razorpay Verify Payment Response
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_KHmgvKUnt3Bfm8"
}
```

### Stripe Create Intent Response
```json
{
  "clientSecret": "pi_KHmgvKUnt3Bfm8_secret_xxxx",
  "amount": 50000,
  "currency": "inr"
}
```

---

## Support & Resources

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay API Reference:** https://razorpay.com/docs/api/
- **Stripe Documentation:** https://stripe.com/docs
- **Stripe API Reference:** https://stripe.com/docs/api

---

## Summary

Your e-commerce platform now supports:
- ✅ **Razorpay** with full UPI support (primary for India)
- ✅ **Stripe** for international card payments
- ✅ **Bank Transfer** for manual payments
- ✅ Secure server-side verification
- ✅ Multiple payment options in checkout
- ✅ Order tracking with payment status
- ✅ Error handling and user feedback

Start by configuring test keys and testing the payment flow with test data provided above.
