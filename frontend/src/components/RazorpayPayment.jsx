import React, { useState } from 'react';
import api from '../services/api';
import '../styles/payment.css';

const RazorpayPayment = ({ orderId, amount, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create Razorpay order
      const response = await api.post('/payments/razorpay/create-order', {
        orderId,
        amount, // amount in rupees
      });

      const { razorpayOrderId, message } = response.data;

      if (!window.Razorpay) {
        throw new Error('Razorpay not loaded');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100, // amount in paise
        currency: 'INR',
        name: 'JMC Enterprises',
        description: `Order Payment - ${orderId}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await api.post('/payments/razorpay/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            if (verifyResponse.data.success) {
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                status: 'completed',
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            onPaymentError(error.message);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: '#2d5016',
        },
        method: {
          upi: true,
          card: true,
          wallet: true,
          netbanking: true,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      onPaymentError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-gateway razorpay-payment">
      <div className="payment-header">
        <h4>💳 Razorpay Payment (UPI, Cards & More)</h4>
        <p className="payment-description">
          Pay instantly using UPI, Credit/Debit Card, Wallet, or Net Banking
        </p>
      </div>
      <div className="payment-amount">
        <p>Amount to Pay: <strong>₹{amount.toFixed(2)}</strong></p>
      </div>
      <button
        className="btn btn-primary btn-lg w-100 payment-btn"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </>
        ) : (
          '🚀 Pay Now with Razorpay'
        )}
      </button>
      <p className="payment-note">
        <small className="text-muted">
          ✓ Secure payment • ✓ UPI Support • ✓ Multiple payment options
        </small>
      </p>
    </div>
  );
};

export default RazorpayPayment;
