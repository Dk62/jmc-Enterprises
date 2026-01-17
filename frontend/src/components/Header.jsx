import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/header.css';
import useAuthStore from '../context/authStore';
import useCartStore from '../context/cartStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = useState(false);

  // Debug user status
  console.log('Header - Current user:', user);
  console.log('Header - Is Admin:', user?.isAdmin);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setNavbarOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <i className="bi bi-leaf-fill"></i>
          {t('appName') || 'JMC Enterprises'}
        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/" onClick={() => setNavbarOpen(false)}>
                <i className="bi bi-house"></i> {t('home')}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/products" onClick={() => setNavbarOpen(false)}>
                <i className="bi bi-basket"></i> {t('products')}
              </a>
            </li>
            {user?.isAdmin && (
              <li className="nav-item">
                <a className="nav-link" href="/admin/products" onClick={() => setNavbarOpen(false)}>
                  <i className="bi bi-gear"></i> {t('admin')}
                </a>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link" href="/about" onClick={() => setNavbarOpen(false)}>
                <i className="bi bi-info-circle"></i> {t('about')}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact" onClick={() => setNavbarOpen(false)}>
                <i className="bi bi-chat-left-text"></i> {t('contact')}
              </a>
            </li>
          </ul>

          <div className="d-flex gap-2 align-items-center ms-3">
            {/* Language Selector */}
            <div className="btn-group" role="group">
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`btn btn-sm ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline-light'}`}
              >
                EN
              </button>
              <button 
                onClick={() => handleLanguageChange('hi')}
                className={`btn btn-sm ${i18n.language === 'hi' ? 'btn-primary' : 'btn-outline-light'}`}
              >
                हि
              </button>
            </div>

            {/* Cart Link */}
            <a href="/cart" className="btn btn-outline-light btn-sm" onClick={() => setNavbarOpen(false)}>
              <i className="bi bi-cart2"></i> {items.length}
            </a>

            {/* User Menu */}
            {user ? (
              <div className="dropdown">
                <button className="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle"></i> {user.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="/account" onClick={() => setNavbarOpen(false)}>
                      <i className="bi bi-person"></i> {t('account')}
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> {t('logout')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <a href="/login" className="btn btn-outline-light btn-sm" onClick={() => setNavbarOpen(false)}>
                  <i className="bi bi-box-arrow-in-right"></i> {t('login')}
                </a>
                <a href="/register" className="btn btn-success btn-sm" onClick={() => setNavbarOpen(false)}>
                  <i className="bi bi-person-plus"></i> {t('register')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
