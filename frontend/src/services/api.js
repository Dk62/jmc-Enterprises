import axios from 'axios';
import useAuthStore from '../context/authStore';

const API_BASE = '/api';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    Authorization: token ? `Bearer ${token}` : ''
  };
};

// Auth API
export const authAPI = {
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
  getCurrentUser: () => axios.get(`${API_BASE}/auth/me`, { headers: getHeaders() }),
  logout: () => axios.post(`${API_BASE}/auth/logout`, {}, { headers: getHeaders() })
};

// Product API
export const productAPI = {
  getProducts: (params) => axios.get(`${API_BASE}/products`, { params }),
  getProductById: (id) => axios.get(`${API_BASE}/products/${id}`),
  createProduct: (data) => axios.post(`${API_BASE}/products`, data, { headers: getHeaders() }),
  updateProduct: (id, data) => axios.put(`${API_BASE}/products/${id}`, data, { headers: getHeaders() }),
  deleteProduct: (id) => axios.delete(`${API_BASE}/products/${id}`, { headers: getHeaders() }),
  addReview: (id, data) => axios.post(`${API_BASE}/products/${id}/review`, data, { headers: getHeaders() })
};

// Cart API
export const cartAPI = {
  getCart: () => axios.get(`${API_BASE}/cart`, { headers: getHeaders() }),
  addToCart: (data) => axios.post(`${API_BASE}/cart/add`, data, { headers: getHeaders() }),
  updateCartItem: (data) => axios.put(`${API_BASE}/cart/update`, data, { headers: getHeaders() }),
  removeFromCart: (data) => axios.post(`${API_BASE}/cart/remove`, data, { headers: getHeaders() }),
  clearCart: () => axios.delete(`${API_BASE}/cart/clear`, { headers: getHeaders() })
};

// Order API
export const orderAPI = {
  createOrder: (data) => axios.post(`${API_BASE}/orders`, data, { headers: getHeaders() }),
  getUserOrders: () => axios.get(`${API_BASE}/orders/my-orders`, { headers: getHeaders() }),
  getOrderById: (id) => axios.get(`${API_BASE}/orders/${id}`, { headers: getHeaders() }),
  updateOrderStatus: (id, data) => axios.put(`${API_BASE}/orders/${id}/status`, data, { headers: getHeaders() }),
  cancelOrder: (id) => axios.post(`${API_BASE}/orders/${id}/cancel`, {}, { headers: getHeaders() }),
  getAllOrders: (params) => axios.get(`${API_BASE}/orders`, { params, headers: getHeaders() })
};

// User API
export const userAPI = {
  getUserProfile: () => axios.get(`${API_BASE}/users/profile`, { headers: getHeaders() }),
  updateUserProfile: (data) => axios.put(`${API_BASE}/users/profile`, data, { headers: getHeaders() }),
  changePassword: (data) => axios.put(`${API_BASE}/users/change-password`, data, { headers: getHeaders() }),
  getAllUsers: (params) => axios.get(`${API_BASE}/users`, { params, headers: getHeaders() }),
  deleteUser: (id) => axios.delete(`${API_BASE}/users/${id}`, { headers: getHeaders() }),
  makeAdmin: (id) => axios.put(`${API_BASE}/users/${id}/make-admin`, {}, { headers: getHeaders() })
};

// Default export
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
