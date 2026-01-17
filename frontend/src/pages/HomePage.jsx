import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import api from '../services/api';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products');
        setFeaturedProducts(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4">
                <i className="bi bi-leaf-fill"></i> {t('appName') || 'JMC Enterprises'}
              </h1>
              <p className="lead mb-4">
                {t('tagline') || 'Your trusted partner for premium agricultural products - Seeds, Fertilizers & Pesticides'}
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <button 
                  onClick={() => navigate('/products')} 
                  className="btn btn-primary btn-lg"
                >
                  <i className="bi bi-basket"></i> {t('shopNow')}
                </button>
                <button 
                  onClick={() => navigate('/about')} 
                  className="btn btn-outline-light btn-lg"
                >
                  <i className="bi bi-info-circle"></i> {t('learnMore')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: 'var(--primary-green)' }}>
            <i className="bi bi-star-fill"></i> Why Choose Us?
          </h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-shield-check" style={{ fontSize: '2.5rem', color: 'var(--accent-green)' }}></i>
                  <h5 className="card-title mt-3" style={{ color: 'var(--primary-green)' }}>Premium Quality</h5>
                  <p className="card-text">
                    Only certified agricultural products from trusted suppliers
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-truck" style={{ fontSize: '2.5rem', color: 'var(--accent-green)' }}></i>
                  <h5 className="card-title mt-3" style={{ color: 'var(--primary-green)' }}>Fast Delivery</h5>
                  <p className="card-text">
                    Quick and reliable shipping to your farm or doorstep
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-lock-fill" style={{ fontSize: '2.5rem', color: 'var(--accent-green)' }}></i>
                  <h5 className="card-title mt-3" style={{ color: 'var(--primary-green)' }}>Secure Payment</h5>
                  <p className="card-text">
                    Safe transactions with multiple payment options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: 'var(--primary-green)' }}>
            <i className="bi bi-star"></i> Featured Products
          </h2>
          
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div key={product._id} className="col-md-6 col-lg-4">
                  <div className="card product-card h-100">
                    <div className="product-image bg-light">
                      <div style={{ fontSize: '3rem' }}>🌾</div>
                    </div>
                    <div className="card-body">
                      <span className={`badge product-category category-${product.category.toLowerCase()}`}>
                        {product.category}
                      </span>
                      <h5 className="card-title mt-2 product-name">{product.name}</h5>
                      <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                        {product.description.substring(0, 60)}...
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="product-price">₹{product.price}</span>
                        <div className="text-warning">
                          <i className="bi bi-star-fill"></i> {product.rating}
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="btn btn-add-to-cart mt-3"
                      >
                        <i className="bi bi-eye"></i> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <button 
              onClick={() => navigate('/products')} 
              className="btn btn-primary btn-lg"
            >
              <i className="bi bi-arrow-right"></i> View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--very-light-green)' }}>
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: 'var(--primary-green)' }}>
            <i className="bi bi-collection"></i> Categories
          </h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 text-center cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => navigate('/products?category=Seeds')}>
                <div className="card-body py-5">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                  <h5 className="card-title" style={{ color: 'var(--primary-green)' }}>Seeds</h5>
                  <p className="card-text text-muted">Premium quality hybrid and organic seeds</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 text-center cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => navigate('/products?category=Fertilizers')}>
                <div className="card-body py-5">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
                  <h5 className="card-title" style={{ color: 'var(--primary-green)' }}>Fertilizers</h5>
                  <p className="card-text text-muted">Organic and chemical fertilizers for all crops</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 text-center cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => navigate('/products?category=Pesticides')}>
                <div className="card-body py-5">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                  <h5 className="card-title" style={{ color: 'var(--primary-green)' }}>Pesticides</h5>
                  <p className="card-text text-muted">Effective pest and disease control solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
