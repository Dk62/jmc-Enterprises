import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import useCartStore from '../context/cartStore';
import useAuthStore from '../context/authStore';
import RazorpayPayment from '../components/RazorpayPayment';
import StripePayment from '../components/StripePayment';
import '../styles/checkout.css';
import '../styles/payment.css';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form'); // form, payment, success
  const [orderId, setOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    country: user?.country || '',
    phone: user?.phone || '',
    paymentMethod: 'razorpay'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone
      };

      const orderResponse = await orderAPI.createOrder({
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        items: items
      });

      setOrderId(orderResponse._id || orderResponse.data._id);
      setPaymentStep('payment');
      setPaymentError(null);
    } catch (error) {
      console.error('Error creating order:', error);
      setPaymentError(error.message || 'Failed to create order');
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Update order with payment info
      await orderAPI.updateOrder(orderId, {
        paymentStatus: 'completed',
        paymentId: paymentData.paymentId,
        status: 'confirmed'
      });

      clearCart();
      setPaymentStep('success');
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Payment successful but there was an issue updating your order');
    }
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setPaymentStep('form');
  };

  return (
    <div className="checkout-page">
      <h1>{t('checkout')}</h1>

      <div className="checkout-container">
        {paymentStep === 'form' && (
          <>
            {paymentError && (
              <div className="payment-error">
                {paymentError}
                <button 
                  className="btn-small" 
                  onClick={() => setPaymentError(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <form className="checkout-form" onSubmit={handleSubmitOrder}>
              <div className="form-section">
                <h2>Shipping Address</h2>
                
                <div className="form-row">
                  <input 
                    type="text"
                    name="firstName"
                    placeholder={t('firstName')}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <input 
                    type="text"
                    name="lastName"
                    placeholder={t('lastName')}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <input 
                  type="text"
                  name="address"
                  placeholder={t('address')}
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="full-width"
                />

                <div className="form-row">
                  <input 
                    type="text"
                    name="city"
                    placeholder={t('city')}
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <input 
                    type="text"
                    name="postalCode"
                    placeholder={t('postalCode')}
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <input 
                    type="text"
                    name="country"
                    placeholder={t('country')}
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                  <input 
                    type="tel"
                    name="phone"
                    placeholder={t('phone')}
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-method-selector">
                  <label className={`payment-method-card ${formData.paymentMethod === 'razorpay' ? 'active' : ''}`}>
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    <h5>💳 Razorpay</h5>
                    <p>UPI, Cards, Wallets</p>
                  </label>
                  <label className={`payment-method-card ${formData.paymentMethod === 'stripe' ? 'active' : ''}`}>
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    <h5>🌍 Stripe</h5>
                    <p>International Cards</p>
                  </label>
                  <label className={`payment-method-card ${formData.paymentMethod === 'bank_transfer' ? 'active' : ''}`}>
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    <h5>🏦 Bank Transfer</h5>
                    <p>Manual Payment</p>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </form>
          </>
        )}

        {paymentStep === 'payment' && (
          <div className="payment-section">
            {formData.paymentMethod === 'razorpay' && (
              <RazorpayPayment
                orderId={orderId}
                amount={getTotal()}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
            {formData.paymentMethod === 'stripe' && (
              <StripePayment
                orderId={orderId}
                amount={getTotal()}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
            {formData.paymentMethod === 'bank_transfer' && (
              <div className="payment-gateway">
                <div className="payment-header">
                  <h4>🏦 Bank Transfer</h4>
                  <p className="payment-description">Transfer funds to our bank account</p>
                </div>
                <div className="payment-amount">
                  <p>Amount to Pay: <strong>₹{getTotal().toFixed(2)}</strong></p>
                </div>
                <div className="bank-details">
                  <p><strong>Bank Name:</strong> State Bank of India</p>
                  <p><strong>Account Holder:</strong> JMC Enterprises</p>
                  <p><strong>Account Number:</strong> 1234567890</p>
                  <p><strong>IFSC Code:</strong> SBIN0001234</p>
                  <p><strong>Reference:</strong> {orderId}</p>
                </div>
                <button
                  className="btn btn-primary btn-lg w-100 payment-btn"
                  onClick={() => handlePaymentSuccess({
                    paymentId: `BANK_${orderId}`,
                    orderId,
                    status: 'pending'
                  })}
                >
                  I've Transferred the Funds
                </button>
              </div>
            )}
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="payment-success-section">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>Your order has been placed successfully.</p>
            <p>Redirecting to your orders...</p>
          </div>
        )}

        <div className="order-summary">
          <h2>Order Summary</h2>
          {items.map(item => (
            <div key={item.productId} className="summary-item">
              <span>{item.productName} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>{t('grandTotal')}</span>
            <span>₹{getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
