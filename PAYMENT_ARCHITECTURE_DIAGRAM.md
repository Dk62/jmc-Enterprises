# Payment Gateway Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Checkout Page (Vite)                 │  │
│  │                                                          │  │
│  │  1. Fill Shipping Address Form                         │  │
│  │  2. Select Payment Method                              │  │
│  │     - Razorpay (UPI, Cards, Wallets)                  │  │
│  │     - Stripe (International Cards)                     │  │
│  │     - Bank Transfer (Manual)                           │  │
│  │  3. Submit Order                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                       │
│         └──→ axios POST /api/orders (Create Order)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         │ JWT Token (Authorization Header)
         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js/Express)                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Order Route: POST /api/orders                   │  │
│  │                                                          │  │
│  │  1. Verify JWT Token                                   │  │
│  │  2. Validate Order Data                                │  │
│  │  3. Create Order in MongoDB                            │  │
│  │  4. Return Order ID to Client                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                       │
│         └──→ Response: { _id, total, items, ... }            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│                   CLIENT - Payment Processing                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  IF Razorpay Selected:                                  │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ 1. Load Razorpay Script Dynamically              │ │  │
│  │  │ 2. Call POST /api/payments/razorpay/create-order │ │  │
│  │  │ 3. Receive razorpayOrderId & Key                │ │  │
│  │  │ 4. Initialize Razorpay Modal                    │ │  │
│  │  │ 5. User selects UPI/Card/Wallet                │ │  │
│  │  │ 6. Razorpay processes payment                  │ │  │
│  │  │ 7. Get payment_id & signature back             │ │  │
│  │  │ 8. Call POST /api/payments/razorpay/verify    │ │  │
│  │  │ 9. Server verifies HMAC signature              │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ELSE IF Stripe Selected:                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ 1. Load Stripe.js                                 │ │  │
│  │  │ 2. Call POST /api/payments/stripe/create-intent  │ │  │
│  │  │ 3. Receive clientSecret                          │ │  │
│  │  │ 4. User enters card details                      │ │  │
│  │  │ 5. Confirm payment with Stripe                  │ │  │
│  │  │ 6. Get paymentIntentId back                     │ │  │
│  │  │ 7. Call POST /api/payments/stripe/verify        │ │  │
│  │  │ 8. Server verifies payment status               │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ELSE IF Bank Transfer Selected:                        │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ 1. Show Bank Details                              │ │  │
│  │  │ 2. User manually transfers funds                 │ │  │
│  │  │ 3. Click "Funds Transferred"                    │ │  │
│  │  │ 4. Order status = pending_verification           │ │  │
│  │  │ 5. Admin verifies transfer                      │ │  │
│  │  │ 6. Order status = confirmed                     │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                       │
│         └──→ Payment Verification Response                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│           SERVER - Payment Verification & Order Update         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Payment Verification Route                            │  │
│  │                                                          │  │
│  │  FOR RAZORPAY:                                         │  │
│  │  1. Extract payment_id, signature, order_id           │  │
│  │  2. Reconstruct HMAC using order details              │  │
│  │  3. Compare with received signature                   │  │
│  │  4. If match: Payment verified ✓                      │  │
│  │  5. If mismatch: Payment failed ✗                     │  │
│  │                                                          │  │
│  │  FOR STRIPE:                                           │  │
│  │  1. Retrieve PaymentIntent from Stripe                │  │
│  │  2. Check status = 'succeeded'                        │  │
│  │  3. If true: Payment verified ✓                       │  │
│  │  4. If false: Payment failed ✗                        │  │
│  │                                                          │  │
│  │  DATABASE UPDATE:                                      │  │
│  │  1. Update Order.paymentStatus = 'completed'          │  │
│  │  2. Update Order.status = 'confirmed'                 │  │
│  │  3. Update Order.paymentId                            │  │
│  │  4. Clear user's cart                                 │  │
│  │  5. Trigger order confirmation email                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                       │
│         └──→ Response: { success: true, paymentId, orderId } │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│              CLIENT - Success & Redirect                        │
│                                                                 │
│  1. Show success animation                                     │
│  2. Display "Payment Successful!" message                      │
│  3. Auto-redirect to /account after 2 seconds                 │
│  4. Show order in user's order history                        │
│  5. Display order tracking information                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Razorpay Payment Flow (UPI)

```
User selects Razorpay
         │
         ↓
Load Razorpay Script
         │
         ↓
Frontend → Backend: POST /api/payments/razorpay/create-order
                    { orderId, amount }
         │
         ↓
Backend:
1. Verify Order exists
2. Verify Amount matches
3. Create Razorpay Order
4. Return razorpayOrderId
         │
         ↓
Frontend receives razorpayOrderId
         │
         ↓
Open Razorpay Modal
         │
         ├─→ Select Payment Method
         │   ├─ UPI (Google Pay, PhonePe, BHIM)
         │   ├─ Credit/Debit Card
         │   ├─ Net Banking
         │   └─ Wallet
         │
         ↓
User completes payment in Razorpay
         │
         ↓
Razorpay returns:
{
  razorpay_payment_id: "pay_KHmgvKUnt3Bfm8",
  razorpay_order_id: "order_KHmgvKUnt3Bfm8",
  razorpay_signature: "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
         │
         ↓
Frontend → Backend: POST /api/payments/razorpay/verify-payment
                    { 
                      razorpay_payment_id,
                      razorpay_order_id,
                      razorpay_signature 
                    }
         │
         ↓
Backend Verification:
1. Reconstruct signature:
   hmac_sha256(order_id|payment_id, SECRET_KEY)
   
2. Compare with received signature
   
3. If match:
   ✓ Payment verified
   ✓ Update Order.paymentStatus = 'completed'
   ✓ Update Order.status = 'confirmed'
   
4. If mismatch:
   ✗ Payment failed
   ✗ Log security alert
         │
         ↓
Return response: { success: true/false }
         │
         ↓
Frontend handles response
├─ Success: Show confirmation & redirect
└─ Failure: Show error message & allow retry
```

---

## Stripe Card Payment Flow

```
User selects Stripe
         │
         ↓
Load Stripe.js
         │
         ↓
Create Elements Provider with Stripe Key
         │
         ↓
Render Card Element
         │
         ↓
User enters card details:
- Card number
- Expiry date (MM/YY)
- CVC
- Name
         │
         ↓
Frontend → Backend: POST /api/payments/stripe/create-intent
                    { orderId, amount }
         │
         ↓
Backend:
1. Verify Order exists
2. Verify Amount matches
3. Create Stripe PaymentIntent
4. Return clientSecret
         │
         ↓
Frontend receives clientSecret
         │
         ↓
Confirm Payment with clientSecret
         │
         ↓
Stripe processes payment
         │
         ├─ May require 3D Secure auth
         │  (Customer enters password)
         │
         ↓
Stripe returns PaymentIntent
         │
         ↓
Frontend → Backend: POST /api/payments/stripe/verify-payment
                    { paymentIntentId, orderId }
         │
         ↓
Backend Verification:
1. Retrieve PaymentIntent from Stripe
2. Check status field
3. If status = 'succeeded':
   ✓ Payment verified
   ✓ Update Order.paymentStatus = 'completed'
   ✓ Update Order.status = 'confirmed'
   
4. If status != 'succeeded':
   ✗ Payment failed
   ✗ Log transaction details
         │
         ↓
Return response: { success: true/false }
         │
         ↓
Frontend handles response
├─ Success: Show confirmation & redirect
└─ Failure: Show error message & allow retry
```

---

## Database Schema Update

```javascript
Order Schema (Updated):
{
  _id: ObjectId,
  userId: ObjectId,
  
  // Shipping Information
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  
  // Order Items
  items: [
    {
      productId: ObjectId,
      productName: String,
      price: Number,
      quantity: Number,
      specifications: Object
    }
  ],
  
  // Pricing
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  totalPrice: Number,
  
  // Payment Information (NEW)
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
  razorpayPaymentId: String,
  stripePaymentIntentId: String,
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Verification Process

### Razorpay HMAC Verification

```javascript
// Backend verification code
const crypto = require('crypto');

// Data received from client
const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
} = paymentData;

// Reconstruct the signature
const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(body)
  .digest('hex');

// Verify signatures match
if (expectedSignature === razorpay_signature) {
  // ✓ Payment verified - payment is genuine
  updateOrderStatus('completed');
} else {
  // ✗ Payment failed - tampering detected
  throw new Error('Payment verification failed');
}
```

### Stripe Intent Verification

```javascript
// Backend verification code
const stripe = require('stripe')(STRIPE_SECRET_KEY);

// Retrieve PaymentIntent from Stripe
const paymentIntent = await stripe.paymentIntents.retrieve(
  paymentIntentId
);

// Check status
if (paymentIntent.status === 'succeeded') {
  // ✓ Payment verified - payment completed
  updateOrderStatus('completed');
} else if (paymentIntent.status === 'requires_action') {
  // ⚠ Payment requires additional action (3D Secure)
  throw new Error('Additional authentication required');
} else {
  // ✗ Payment failed
  throw new Error('Payment not completed');
}
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

### Razorpay Verify Payment Response (Success)
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_KHmgvKUnt3Bfm8",
  "orderId": "order_KHmgvKUnt3Bfm8"
}
```

### Razorpay Verify Payment Response (Failure)
```json
{
  "success": false,
  "message": "Payment signature verification failed",
  "error": "HMAC signature mismatch"
}
```

### Stripe Create Intent Response
```json
{
  "clientSecret": "pi_KHmgvKUnt3Bfm8_secret_fJzV3Wx7K",
  "amount": 5000,
  "currency": "inr",
  "status": "requires_payment_method"
}
```

### Stripe Verify Payment Response (Success)
```json
{
  "success": true,
  "message": "Payment successful",
  "paymentIntentId": "pi_KHmgvKUnt3Bfm8",
  "status": "succeeded"
}
```

---

## Error Handling Flow

```
Payment Error Occurs
         │
         ├─→ Network Error
         │   └─ Retry with exponential backoff
         │
         ├─→ Gateway Error
         │   ├─ Razorpay unavailable: Show "Try again later"
         │   └─ Stripe unavailable: Show "Try again later"
         │
         ├─→ Card Declined
         │   ├─ Insufficient funds: "Please check card balance"
         │   ├─ Expired card: "Card has expired"
         │   ├─ Invalid CVV: "Invalid security code"
         │   └─ Address mismatch: "Address doesn't match"
         │
         ├─→ Authentication Required
         │   └─ 3D Secure: "Additional verification required"
         │
         ├─→ Order Validation Error
         │   ├─ Amount mismatch: "Order amount changed"
         │   ├─ Invalid order: "Order not found"
         │   └─ Duplicate payment: "Payment already processed"
         │
         └─→ Server Error
             └─ Verification failed: "Payment could not be verified"

All errors:
1. Log to error tracking system
2. Display user-friendly message
3. Allow user to retry or select different method
4. Keep order in system for manual resolution
```

---

## Production Deployment Checklist

```
BEFORE GOING LIVE
═════════════════

Security
□ All API keys moved to environment variables
□ Never commit .env file with keys
□ HTTPS enabled on backend
□ CORS properly configured for production domain
□ Rate limiting enabled on payment endpoints
□ SQL injection prevention verified
□ XSS protection enabled
□ CSRF tokens implemented

Configuration
□ Test keys replaced with live keys
□ Webhook endpoints registered
□ Email notifications configured
□ Error tracking/logging setup
□ Payment analytics enabled
□ Database backups automated

Testing
□ All payment flows tested end-to-end
□ Error scenarios tested
□ Refund process tested (if applicable)
□ Payment reconciliation tested
□ Edge cases tested (network failures, etc.)
□ Mobile payment tested
□ Different browsers tested

Monitoring
□ Payment dashboard setup
□ Transaction alerts configured
□ Downtime notifications enabled
□ Error rate monitoring active
□ Performance metrics tracked
□ Fraud detection enabled

Documentation
□ API documentation updated
□ Support documentation prepared
□ Admin training completed
□ Customer FAQs prepared
□ Incident response plan ready

Compliance
□ PCI-DSS compliance verified
□ Data protection policy updated
□ Terms & conditions updated
□ Privacy policy updated
□ Customer communication drafted
```

---

## Summary

This architecture ensures:
✅ Secure payment processing  
✅ Multiple payment gateway options  
✅ UPI support for Indian customers  
✅ Verified transactions  
✅ Scalable infrastructure  
✅ User-friendly experience  
✅ Production-ready implementation
