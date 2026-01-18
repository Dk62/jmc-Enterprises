import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: 'var(--primary-green)', color: 'white' }} className="mt-5">
      <div className="container py-5">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-md-3">
            <h5 style={{ color: 'var(--accent-green)' }}>
              <i className="bi bi-leaf-fill"></i> {t('appName') || 'JMC Enterprises'}
            </h5>
            <p className="text-muted">
              Your trusted partner for premium agricultural products - Seeds, Fertilizers & Pesticides
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-sm btn-outline-light">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-light">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-light">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 style={{ color: 'var(--accent-green)' }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-white-50">{t('home')}</a></li>
              <li><a href="/products" className="text-decoration-none text-white-50">{t('products')}</a></li>
              <li><a href="/about" className="text-decoration-none text-white-50">{t('about')}</a></li>
              <li><a href="/contact" className="text-decoration-none text-white-50">{t('contact')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3">
            <h5 style={{ color: 'var(--accent-green)' }}>{t('contact')}</h5>
            <p className="text-white-50 mb-2">
              <i className="bi bi-envelope"></i> Email id: dilkhushkumar@gmail.com
            </p>
            <p className="text-white-50 mb-2">
              <i className="bi bi-telephone"></i> Phone: +91 9876543210
            </p>
            <p className="text-white-50">
              <i className="bi bi-geo-alt"></i> India
            </p>
          </div>

          {/* Products */}
          <div className="col-md-3">
            <h5 style={{ color: 'var(--accent-green)' }}>Categories</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/products?category=Seeds" className="text-decoration-none text-white-50">
                  <i className="bi bi-arrow-right-short"></i> {t('seeds')}
                </a>
              </li>
              <li>
                <a href="/products?category=Fertilizers" className="text-decoration-none text-white-50">
                  <i className="bi bi-arrow-right-short"></i> {t('fertilizers')}
                </a>
              </li>
              <li>
                <a href="/products?category=Pesticides" className="text-decoration-none text-white-50">
                  <i className="bi bi-arrow-right-short"></i> {t('pesticides')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--pale-green)' }} className="my-4" />

        {/* Footer Bottom */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start text-white-50 small">
            <p className="mb-0">
              &copy; {currentYear} {t('appName')}. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#privacy" className="text-decoration-none text-white-50 me-3 small">Privacy Policy</a>
            <a href="#terms" className="text-decoration-none text-white-50 small">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
