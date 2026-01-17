import React from 'react';
import { useTranslation } from 'react-i18next';
import useCartStore from '../context/cartStore';
import { useNavigate } from 'react-router-dom';
import '../styles/cart.css';

const CartPage = () => {
  const { t } = useTranslation();
  const { items, removeFromCart, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h1>{t('cart')}</h1>

      {items.length > 0 ? (
        <div className="cart-container">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.image} alt={item.productName} />
                <div className="item-details">
                  <h3>{item.productName}</h3>
                  <p>${item.price}</p>
                </div>
                <div className="item-actions">
                  <input 
                    type="number" 
                    min="1" 
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                  />
                  <button onClick={() => removeFromCart(item.productId)}>
                    {t('removeFromCart')}
                  </button>
                </div>
                <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>{t('orderSummary')}</h2>
            <div className="summary-row">
              <span>{t('subtotal')}</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>{t('shipping')}</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row">
              <span>{t('tax')}</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row total">
              <span>{t('grandTotal')}</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <button 
              className="btn-checkout"
              onClick={() => navigate('/checkout')}
            >
              {t('checkout')}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')}>
            {t('continueShopping')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
