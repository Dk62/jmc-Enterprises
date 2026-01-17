import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import useCartStore from '../context/cartStore';
import useAuthStore from '../context/authStore';
import '../styles/checkout.css';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    country: user?.country || '',
    phone: user?.phone || '',
    paymentMethod: 'stripe'
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

      await orderAPI.createOrder({
        shippingAddress,
        paymentMethod: formData.paymentMethod
      });

      clearCart();
      alert(t('success'));
      navigate('/account');
    } catch (error) {
      console.error('Error creating order:', error);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>{t('checkout')}</h1>

      <div className="checkout-container">
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
            <div className="payment-options">
              <label>
                <input 
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={formData.paymentMethod === 'stripe'}
                  onChange={handleInputChange}
                />
                Credit/Debit Card (Stripe)
              </label>
              <label>
                <input 
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleInputChange}
                />
                PayPal
              </label>
              <label>
                <input 
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={handleInputChange}
                />
                Bank Transfer
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? t('loading') : t('submitOrder')}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {items.map(item => (
            <div key={item.productId} className="summary-item">
              <span>{item.productName} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>{t('grandTotal')}</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
