import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/payment.css';

const StripePayment = ({ orderId, amount, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);

  useEffect(() => {
    // Load Stripe from CDN
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      if (window.Stripe) {
        const stripeInstance = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        setStripe(stripeInstance);

        // Create and mount card element
        const elements = stripeInstance.elements();
        const card = elements.create('card');
        card.mount('#card-element');
        setCardElement(card);
      }
    };
    script.onerror = () => {
      onPaymentError('Failed to load Stripe. Please refresh the page.');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onPaymentError]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !cardElement) {
      onPaymentError('Stripe is still loading. Please wait.');
      return;
    }

    try {
      setLoading(true);

      // Create payment intent
      const response = await api.post('/payments/stripe/create-intent', {
        orderId,
        amount,
      });

      const { clientSecret } = response.data;

      // Confirm payment using Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Verify on backend
        const verifyResponse = await api.post('/payments/stripe/verify-payment', {
          paymentIntentId: result.paymentIntent.id,
          orderId,
        });

        if (verifyResponse.data.success) {
          onPaymentSuccess({
            paymentId: result.paymentIntent.id,
            orderId,
            status: 'completed',
          });
        }
      }
    } catch (error) {
      onPaymentError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-gateway stripe-payment">
      <div className="payment-header">
        <h4>💳 Stripe Payment (International Cards)</h4>
        <p className="payment-description">Pay securely with your credit or debit card</p>
      </div>
      <div className="payment-amount">
        <p>Amount to Pay: <strong>${(amount / 83).toFixed(2)}</strong> (USD)</p>
      </div>
      <form onSubmit={handlePayment} className="stripe-form">
        <div className="card-element-container" id="card-element">
          {/* Card element will be inserted here by Stripe */}
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg w-100 payment-btn mt-3"
          disabled={loading || !stripe}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            '🚀 Pay Now with Stripe'
          )}
        </button>
      </form>
      <p className="payment-note">
        <small className="text-muted">
          ✓ Secure payment • ✓ Multiple card types • ✓ International support
        </small>
      </p>
    </div>
  );
};

export default StripePayment;
