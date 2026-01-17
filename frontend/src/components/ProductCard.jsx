import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../context/authStore';
import useCartStore from '../context/cartStore';
import { useNavigate } from 'react-router-dom';
import '../styles/product-card.css';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    addToCart(product, quantity);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  return (
    <div className="card product-card h-100">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="placeholder-image">🌾</div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        {/* Category Badge */}
        <div>
          <span className={`badge product-category category-${product.category.toLowerCase()}`}>
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h5 className="card-title mt-2 product-name flex-grow-1">
          {product.name}
        </h5>

        {/* Description */}
        <p className="card-text text-muted small mb-2">
          {product.description.substring(0, 60)}...
        </p>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="mb-2">
            <div className="text-warning">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i}
                  className={`bi ${i < Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'}`}
                ></i>
              ))}
              <span className="ms-2 text-secondary">({product.rating.toFixed(1)})</span>
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="mb-3">
          <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 
              ? `Stock: ${product.stock} units`
              : 'Out of Stock'
            }
          </span>
        </div>

        {/* Price */}
        <h4 className="product-price text-success fw-bold mb-3">
          ₹{product.price}
        </h4>

        {/* Alert */}
        {showAlert && (
          <div className="alert alert-success py-2 mb-2" role="alert">
            <i className="bi bi-check-circle"></i> Added to cart!
          </div>
        )}

        {/* Quantity & Actions */}
        <div className="d-flex gap-2 mt-auto">
          <div className="input-group" style={{ maxWidth: '100px' }}>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={product.stock < 1}
            >
              -
            </button>
            <input 
              type="number" 
              className="form-control form-control-sm text-center"
              min="1" 
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={product.stock < 1}
            />
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={product.stock < 1}
            >
              +
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock < 1}
            className="btn btn-add-to-cart flex-grow-1"
          >
            <i className="bi bi-cart-plus"></i> Add
          </button>
        </div>

        {/* View Details */}
        <a 
          href={`/products/${product._id}`} 
          className="btn btn-outline-primary btn-sm mt-2 w-100"
        >
          <i className="bi bi-eye"></i> View Details
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
