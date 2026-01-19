import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import useCartStore from '../context/cartStore';
import '../styles/product-detail.css';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(t('success'));
  };

  const handleAddReview = async () => {
    if (!user) {
      alert('Please login to add a review');
      return;
    }

    try {
      await productAPI.addReview(id, { rating, comment });
      setComment('');
      setRating(5);
      fetchProduct();
      alert(t('success'));
    } catch (error) {
      console.error('Error adding review:', error);
      alert(t('error'));
    }
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (!product) return <div>{t('error')}</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-content">
          <h1>{product.name}</h1>
          
          <div className="product-rating">
            <span>⭐ {product.rating.toFixed(1)} ({product.reviews.length} {t('reviews')})</span>
          </div>

          <p className="price">₹{product.price}</p>
          
          <p className="description">{product.description}</p>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">{t('quantity')}: {product.stock}</span>
            ) : (
              <span className="out-of-stock">Out of stock</span>
            )}
          </div>

          <div className="actions">
            <input 
              type="number" 
              min="1" 
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <button 
              onClick={handleAddToCart}
              disabled={product.stock < 1}
            >
              {t('addToCart')}
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>{t('reviews')}</h2>
        
        {user && (
          <div className="add-review">
            <h3>{t('writeReview')}</h3>
            <div className="rating-input">
              <label>{t('rating')}:</label>
              <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <textarea 
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleAddReview}>Submit Review</button>
          </div>
        )}

        <div className="reviews-list">
          {product.reviews.map((review, idx) => (
            <div key={idx} className="review">
              <div className="review-header">
                <span className="username">{review.username}</span>
                <span className="rating">⭐ {review.rating}</span>
              </div>
              <p>{review.comment}</p>
              <span className="date">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
