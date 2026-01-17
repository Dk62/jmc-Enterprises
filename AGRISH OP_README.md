# AgriShop - Agriculture E-Commerce Platform

Welcome to **AgriShop**, a modern MERN stack e-commerce platform specifically designed for agricultural products including seeds, fertilizers, and pesticides.

## 🌾 Features

### For Customers (Users)
- **Product Browsing**: Browse products by category (Seeds, Fertilizers, Pesticides)
- **Advanced Search & Filters**: Search products and filter by category and price
- **Product Details**: View detailed product information, specifications, and ratings
- **Shopping Cart**: Add/remove products and manage quantities
- **Secure Checkout**: Complete purchase with shipping and payment information
- **Order Management**: Track orders and view order history
- **User Account**: Manage profile, address, and order history
- **Multi-language Support**: English and Hindi language support
- **Ratings & Reviews**: Read and write product reviews

### For Administrators
- **Product Management**: Add, edit, and delete products
- **Inventory Control**: Manage stock levels
- **Order Management**: View and process customer orders
- **Admin Dashboard**: Overview of all platform activities
- **User Management**: Manage user accounts and permissions

### Technical Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Bootstrap UI**: Clean and professional Bootstrap-based interface
- **Agriculture Theme**: Greenish color scheme suitable for agriculture business
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **State Management**: Zustand for efficient state management
- **Internationalization**: i18next for multi-language support

## 📋 Product Categories

### 1. Seeds
- Hybrid and organic seeds
- High germination rates
- Suitable for various crops and seasons
- Example products: Wheat Seeds, Tomato Seeds, Cabbage Seeds

### 2. Fertilizers
- NPK Fertilizers (Nitrogen-Phosphorus-Potassium)
- Specialized fertilizers for different crops
- Organic and chemical options
- Example products: NPK 20-20-20, Urea Fertilizer, Potassium Chloride

### 3. Pesticides
- Systemic and contact pesticides
- Organic pest control solutions
- Fungicides and specialized treatments
- Example products: Neem Oil, Copper Sulphate Fungicide, Systemic Pesticide

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the backend folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jmc_enterprises
   NODE_ENV=development
   JWT_SECRET=your_secret_key_change_this_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ADMIN_EMAIL=admin@agrish op.com
   ADMIN_PASSWORD=admin123
   ```

### Running the Project

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on: `http://localhost:5000`

2. **Start Frontend Server** (in another terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Application will run on: `http://localhost:5173`

3. **Access the Application**
   - Open browser and go to: `http://localhost:5173`
   - Register a new user or login with admin credentials

## 👥 User Roles & Permissions

### Admin User
- Can access `/admin/products` dashboard
- Full CRUD operations on products
- Can add new products to inventory
- Can delete products from the catalog
- Can update product information and prices
- Can manage stock levels

**Default Admin Credentials:**
- Email: `admin@agrish op.com`
- Password: `admin123`

### Regular User
- Can browse all products
- Can search and filter products
- Can add products to shopping cart
- Can place orders
- Can view order history
- Can write product reviews
- Can manage their profile and address

## 🌐 Language Support

The platform supports two languages:
- **English (EN)**: Default language
- **Hindi (हि)**: For Indian market

Switch languages using the language selector in the navbar.

## 🎨 Design & Color Scheme

### Primary Colors
- **Primary Green**: #2d5016 (Dark green - main branding)
- **Secondary Green**: #4a7c3d (Medium green - accents)
- **Accent Green**: #8bc34a (Light green - highlights and buttons)
- **Pale Green**: #c8e6c9 (Very light - backgrounds)

### Typography
- **Fonts**: Bootstrap default (Segoe UI, system fonts)
- **Headers**: Bold, clean, agriculture-themed
- **Body**: Clear, readable, accessible

### Components
- **Navigation**: Sticky navbar with dropdown menus
- **Cards**: Product cards with hover effects
- **Buttons**: Green-themed with smooth transitions
- **Forms**: Bootstrap-styled with validation
- **Alerts**: Color-coded success/warning/error messages

## 📁 Project Structure

```
jmc_enterprises/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── cart.routes.js
│   │   │   ├── order.routes.js
│   │   │   └── user.routes.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── config/
│   │   │   └── db.js
│   │   └── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   └── AdminProductsPage.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   ├── authStore.js
│   │   │   └── cartStore.js
│   │   ├── styles/
│   │   │   ├── agriculture-theme.css
│   │   │   ├── main.css
│   │   │   └── [other styles]
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   └── hi.json
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
```

## 🔐 Security Features

- **Password Hashing**: BCryptjs for secure password storage
- **JWT Authentication**: JSON Web Tokens for session management
- **CORS Configuration**: Cross-Origin Resource Sharing enabled for frontend
- **Protected Routes**: Admin routes require authentication and admin privileges
- **Input Validation**: Express validator for all user inputs
- **Error Handling**: Comprehensive error handling with meaningful messages

## 🗄️ Database Schema

### User
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  city: String,
  postalCode: String,
  country: String,
  isAdmin: Boolean,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String (Seeds/Fertilizers/Pesticides),
  image: String,
  stock: Number,
  rating: Number,
  reviews: [{
    userId: ObjectId,
    username: String,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  status: String (pending/processing/shipped/delivered),
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:cartId` - Update cart
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

## 🧪 Testing the Application

### Test Admin Features
1. Create admin account or use default credentials
2. Navigate to `/admin/products`
3. Add a new product:
   - Name: "Hybrid Sunflower Seeds"
   - Category: Seeds
   - Price: ₹500
   - Stock: 50
4. Click "Create Product"
5. Verify product appears in admin dashboard and on homepage

### Test User Features
1. Register as a new user
2. Browse products
3. Add product to cart
4. Proceed to checkout
5. Complete order

### Test Multi-language
1. Click language selector (EN / हि) in navbar
2. Verify all text updates to selected language
3. Test on both admin panel and user pages

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on localhost:27017
- Check `MONGODB_URI` in `.env` file
- Verify database name in connection string

### Port Already in Use
- Backend (5000): `npx kill-port 5000`
- Frontend (5173): `npx kill-port 5173`

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches configuration

## 📚 Additional Resources

- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [i18next Guide](https://www.i18next.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For issues, bugs, or feature requests, please contact:
- Email: support@agrish op.com
- Website: https://agrish op.com

---

**Happy Farming! 🌾**
