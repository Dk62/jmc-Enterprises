import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userAPI, orderAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import '../styles/account.css';

const AccountPage = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    country: user?.country || ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const response = await userAPI.updateUserProfile(profileData);
      setUser(response.data.user);
      alert(t('success'));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('error'));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await userAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert(t('success'));
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || t('error'));
    }
  };

  return (
    <div className="account-page">
      <h1>{t('account')}</h1>

      <div className="account-container">
        <div className="tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            {t('profile')}
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            {t('orders')}
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            {t('settings')}
          </button>
        </div>

        {activeTab === 'profile' && (
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <h2>{t('updateProfile')}</h2>

            <div className="form-row">
              <input 
                type="text"
                name="firstName"
                placeholder={t('firstName')}
                value={profileData.firstName}
                onChange={handleProfileInputChange}
              />
              <input 
                type="text"
                name="lastName"
                placeholder={t('lastName')}
                value={profileData.lastName}
                onChange={handleProfileInputChange}
              />
            </div>

            <input 
              type="tel"
              name="phone"
              placeholder={t('phone')}
              value={profileData.phone}
              onChange={handleProfileInputChange}
              className="full-width"
            />

            <input 
              type="text"
              name="address"
              placeholder={t('address')}
              value={profileData.address}
              onChange={handleProfileInputChange}
              className="full-width"
            />

            <div className="form-row">
              <input 
                type="text"
                name="city"
                placeholder={t('city')}
                value={profileData.city}
                onChange={handleProfileInputChange}
              />
              <input 
                type="text"
                name="postalCode"
                placeholder={t('postalCode')}
                value={profileData.postalCode}
                onChange={handleProfileInputChange}
              />
            </div>

            <input 
              type="text"
              name="country"
              placeholder={t('country')}
              value={profileData.country}
              onChange={handleProfileInputChange}
              className="full-width"
            />

            <button type="submit">{t('save')}</button>
          </form>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>{t('orders')}</h2>
            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">Order #{order._id.slice(-8)}</span>
                      <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="order-details">
                      <span className="status">{order.orderStatus}</span>
                      <span className="total">${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="order-items">
                      {order.items.map(item => (
                        <span key={item.productId}>{item.productName} x{item.quantity}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders yet</p>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <form className="settings-form" onSubmit={handleChangePassword}>
            <h2>{t('changePassword')}</h2>

            <input 
              type="password"
              name="oldPassword"
              placeholder={t('oldPassword')}
              value={passwordData.oldPassword}
              onChange={handlePasswordInputChange}
              required
            />

            <input 
              type="password"
              name="newPassword"
              placeholder={t('newPassword')}
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              required
            />

            <input 
              type="password"
              name="confirmPassword"
              placeholder={t('confirmPassword')}
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              required
            />

            <button type="submit">{t('save')}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
