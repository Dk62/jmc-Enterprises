import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import '../styles/auth.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      
      console.log('Login Response:', response.data);
      console.log('User object:', user);
      console.log('Is Admin:', user?.isAdmin);
      
      login(user, token);
      alert(t('success'));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{t('login')}</h1>

        <form onSubmit={handleSubmit}>
          <input 
            type="email"
            name="email"
            placeholder={t('email')}
            value={formData.email}
            onChange={handleInputChange}
            required
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
            {loading ? t('loading') : t('login')}
          </button>
        </form>

        <p>
          Don't have an account? <a href="/register">{t('register')}</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
