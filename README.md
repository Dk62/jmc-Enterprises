# MERN Stack - JMC Enterprises

Complete conversion from Django to MERN Stack (MongoDB, Express, React, Node.js)

## Project Structure

```
.
├── backend/                 # Express.js REST API
│   ├── src/
│   │   ├── index.js        # Server entry point
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & validation
│   │   └── config/         # Database config
│   ├── package.json
│   ├── .env               # Environment variables
│   └── .env.example
│
└── frontend/               # React.js SPA
    ├── src/
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable components
    │   ├── services/      # API client
    │   ├── context/       # State management
    │   ├── locales/       # i18n translations
    │   ├── styles/        # CSS files
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Features

✅ **User Authentication**
- Register & Login with JWT tokens
- Password hashing with bcryptjs
- Protected routes

✅ **Product Management**
- Browse & search products
- Product filtering & sorting
- Product reviews & ratings
- Admin product CRUD operations

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Cart persistence (localStorage)
- Cart total calculation

✅ **Orders & Checkout**
- Create orders from cart
- Multiple payment methods (Stripe, PayPal, Bank Transfer)
- Order tracking
- Admin order management

✅ **User Management**
- User profiles
- Address management
- Password change
- Admin user management

✅ **Localization**
- English & Hindi language support
- Easy language switching
- Persistent language preference

✅ **Admin Features**
- Product management
- Order management & tracking
- User management
- Admin role assignment

## Technology Stack

### Backend
- **Node.js & Express.js** - REST API framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **i18next** - Internationalization
- **Vite** - Build tool & dev server
- **CSS3** - Styling

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file with your config
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
nano .env

# Start development server
npm run dev

# or start production server
npm start
```

**Backend will run on:** `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev

# or build for production
npm run build
```

**Frontend will run on:** `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/review` - Add review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update cart item
- `POST /api/cart/remove` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/cancel` - Cancel order

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `PUT /api/users/:id/make-admin` - Make user admin (Admin)

## Database Models

### User
```javascript
{
  username, email, password, firstName, lastName,
  phone, address, city, postalCode, country,
  isAdmin, avatar, createdAt, updatedAt
}
```

### Product
```javascript
{
  name, description, price, category, image, images,
  stock, rating, reviews, sku, specifications,
  createdAt, updatedAt
}
```

### Cart
```javascript
{
  userId, items: [{ productId, quantity, price }],
  totalPrice, createdAt, updatedAt
}
```

### Order
```javascript
{
  userId, items: [{ productId, quantity, price }],
  shippingAddress, totalPrice, paymentStatus,
  orderStatus, paymentMethod, trackingNumber,
  createdAt, updatedAt
}
```

## Supported Languages

- **English** (en)
- **Hindi** (hi)

Language preference is saved in localStorage and persists across sessions.

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jmc_enterprises
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_key
```

### Frontend
Frontend communicates with backend through proxy configured in `vite.config.js`

## Admin Credentials

Default admin credentials (update after first login):
- Email: `admin@jmc.com`
- Password: `admin123`

## Development

### Hot Reload
- Backend: Nodemon watches for changes
- Frontend: Vite provides instant HMR

### API Testing
Use Postman or VS Code REST Client to test API endpoints.

Example: `POST http://localhost:5000/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Production Deployment

### Backend
1. Build: `npm run build`
2. Set NODE_ENV=production
3. Deploy to AWS, Heroku, or similar
4. Configure MongoDB Atlas for production
5. Set secure JWT_SECRET

### Frontend
1. Build: `npm run build`
2. Deploy static files to Vercel, Netlify, or AWS S3
3. Configure API endpoint for production

## License

MIT License - feel free to use this project for commercial purposes

## Support

For issues and questions, please create an issue in the repository.
