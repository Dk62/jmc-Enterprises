# JMC Enterprises MERN Stack Setup Guide

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Update `backend/.env` with your settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jmc_enterprises
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# On Windows (if installed)
net start MongoDB

# On macOS
brew services start mongodb-community

# On Linux
sudo service mongod start
```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in .env

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected successfully
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v4.1.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

### 5. Test the Application

1. Open browser: http://localhost:5173
2. Create a new account (Register)
3. Log in with your credentials
4. Browse products
5. Add items to cart
6. Proceed to checkout

### 6. Test Admin Features

Use default credentials:
- Email: `admin@jmc.com`
- Password: `admin123`

Admin can:
- Add/Edit/Delete products
- Manage orders
- Manage users
- View analytics

---

## Database Setup

### Adding Sample Products

1. Open MongoDB Compass or mongosh
2. Create database: `jmc_enterprises`
3. Import sample data from `SAMPLE_DATA.js`

Or use MongoDB Compass:
1. Connect to your MongoDB instance
2. Create database `jmc_enterprises`
3. Collections will auto-create on first insert

---

## API Testing

### Using Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import API requests from `backend/src/routes/` files
3. Test endpoints

### Example Requests

**Register User:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Get Products:**
```
GET http://localhost:5000/api/products?category=Electronics&limit=10
```

**Add to Cart (requires auth token):**
```
POST http://localhost:5000/api/cart/add
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

---

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service or check MONGODB_URI

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check CORS_ORIGIN in backend .env matches frontend URL

### Port Already in Use
```
listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in .env or kill process using that port

### NPM Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` in the respective directory

### Frontend Not Connecting to API
**Solution:** 
1. Ensure backend is running
2. Check API_BASE in `frontend/src/services/api.js`
3. Verify CORS_ORIGIN in backend .env

---

## Project Structure Details

### Backend File Structure
```
backend/
├── src/
│   ├── models/
│   │   ├── User.js          # User schema & methods
│   │   ├── Product.js       # Product schema
│   │   ├── Cart.js          # Cart schema
│   │   └── Order.js         # Order schema
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── productController.js  # Product logic
│   │   ├── cartController.js     # Cart logic
│   │   ├── orderController.js    # Order logic
│   │   └── userController.js     # User logic
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   └── user.routes.js
│   ├── middleware/
│   │   └── auth.js          # JWT & admin middleware
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   └── index.js             # Server entry point
├── package.json
└── .env
```

### Frontend File Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── AccountPage.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── services/
│   │   └── api.js           # Axios API client
│   ├── context/
│   │   ├── authStore.js     # Auth state (Zustand)
│   │   └── cartStore.js     # Cart state (Zustand)
│   ├── locales/
│   │   ├── i18n.js          # i18n config
│   │   ├── en.json          # English translations
│   │   └── hi.json          # Hindi translations
│   ├── styles/
│   │   └── *.css            # Component styles
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Next Steps

1. **Customize Products:** Add your product data
2. **Branding:** Update logo, colors, and content
3. **Payment Integration:** Set up Stripe/PayPal
4. **Email Notifications:** Add email for orders
5. **Deploy:** Host on Vercel (frontend) & Heroku (backend)

---

## Troubleshooting Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check MongoDB connection
mongosh

# View npm logs
npm install --verbose

# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

---

## Need Help?

1. Check the console for error messages
2. Review backend logs in terminal 1
3. Check browser DevTools (F12) for frontend errors
4. Verify MongoDB connection with `mongosh`
5. Test API endpoints with Postman

Good luck with your MERN stack development!
