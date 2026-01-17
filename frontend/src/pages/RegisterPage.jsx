import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import '../styles/auth.css';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await authAPI.register(formData);
      const { token, user } = response.data;
      
      login(user, token);
      alert(t('success'));
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      alert(error.response?.data?.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{t('register')}</h1>

        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <input 
            type="email"
            name="email"
            placeholder={t('email')}
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input 
            type="text"
            name="firstName"
            placeholder={t('firstName')}
            value={formData.firstName}
            onChange={handleInputChange}
          />

          <input 
            type="text"
            name="lastName"
            placeholder={t('lastName')}
            value={formData.lastName}
            onChange={handleInputChange}
          />

          <input 
            type="password"
            name="password"
            placeholder={t('password')}
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? t('loading') : t('register')}
          </button>
        </form>

        <p>
          Already have an account? <a href="/login">{t('login')}</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
