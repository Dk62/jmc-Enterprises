import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../context/authStore';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminProductsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Seeds',
    stock: '',
    image: '',
    sku: ''
  });

  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const token = localStorage.getItem('token');
      if (editingId) {
        // Update product
        await api.put(`/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product updated successfully!');
      } else {
        // Create product
        await api.post('/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product created successfully!');
      }
      
      setFormData({ name: '', description: '', price: '', category: 'Seeds', stock: '', image: '', sku: '' });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image || '',
      sku: product.sku || ''
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', category: 'Seeds', stock: '', image: '', sku: '' });
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="admin-panel">
          <div className="admin-header">
            <div className="d-flex justify-content-between align-items-center">
              <h3><i className="bi bi-gear"></i> Admin - Product Management</h3>
              <button 
                onClick={() => setShowForm(!showForm)}
                className={`btn ${showForm ? 'btn-danger' : 'btn-success'}`}
              >
                <i className={`bi ${showForm ? 'bi-x' : 'bi-plus'}`}></i> 
                {showForm ? 'Cancel' : 'Add New Product'}
              </button>
            </div>
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="card mb-4 border-success">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizers">Fertilizers</option>
                        <option value="Pesticides">Pesticides</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Price (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Stock *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">SKU (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Leave empty for auto-generated SKU"
                    />
                    <small className="form-text text-muted">
                      If left empty, SKU will be auto-generated from product name
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-circle"></i> {editingId ? 'Update' : 'Create'} Product
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCancel}
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-x"></i> Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">All Products ({products.length})</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : products.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <strong>{product.name}</strong>
                            <br />
                            <small className="text-muted">
                              {product.description.substring(0, 40)}...
                            </small>
                          </td>
                          <td>
                            <span className={`badge category-${product.category.toLowerCase()}`}>
                              {product.category}
                            </span>
                          </td>
                          <td>₹{product.price}</td>
                          <td>
                            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td>
                            <i className="bi bi-star-fill text-warning"></i> {product.rating}
                          </td>
                          <td>
                            <button
                              onClick={() => handleEdit(product)}
                              className="btn btn-sm btn-primary me-2"
                            >
                              <i className="bi bi-pencil"></i> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="btn btn-sm btn-danger"
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle"></i> No products found. Create your first product!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
