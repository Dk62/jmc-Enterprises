import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/products.css';

const ProductsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  const categories = ['Seeds', 'Fertilizers', 'Pesticides'];

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts({
        search,
        category,
        sort,
        limit: 100
      });
      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page py-5">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 style={{ color: 'var(--primary-green)' }}>
            <i className="bi bi-basket"></i> {t('products')}
          </h1>
          <p className="lead text-muted">Browse our agricultural products</p>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header" style={{ backgroundColor: 'var(--pale-green)' }}>
                <h5 className="mb-0" style={{ color: 'var(--primary-green)' }}>
                  <i className="bi bi-funnel"></i> Filters
                </h5>
              </div>
              <div className="card-body">
                {/* Search */}
                <div className="mb-4">
                  <label className="form-label" style={{ color: 'var(--primary-green)', fontWeight: '600' }}>
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="form-label" style={{ color: 'var(--primary-green)', fontWeight: '600' }}>
                    Category
                  </label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="mb-4">
                  <label className="form-label" style={{ color: 'var(--primary-green)', fontWeight: '600' }}>
                    Sort By
                  </label>
                  <select 
                    value={sort} 
                    onChange={(e) => setSort(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(search || category || sort) && (
                  <button 
                    onClick={() => {
                      setSearch('');
                      setCategory('');
                      setSort('');
                    }}
                    className="btn btn-outline-primary w-100"
                  >
                    <i className="bi bi-x-circle"></i> Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="alert alert-info mb-4">
                  <i className="bi bi-info-circle"></i> Showing <strong>{products.length}</strong> products
                </div>
                <div className="row g-4">
                  {products.map((product) => (
                    <div key={product._id} className="col-md-6 col-lg-4">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="alert alert-warning text-center" role="alert">
                <i className="bi bi-exclamation-triangle"></i> No products found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
