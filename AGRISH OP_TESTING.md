# AgriShop - Quick Setup & Testing Guide

## 🚀 5-Minute Quick Start

### 1. **Check if Servers are Running**
```
Backend: http://localhost:5000
Frontend: http://localhost:5173
```

If not running, start them:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 2. **Open the Application**
- Navigate to: **http://localhost:5173**
- You should see a beautiful green-themed agriculture e-commerce site

## 👥 Testing User Accounts

### Admin Account (Full Control)
```
Email: admin@agrish op.com
Password: admin123
```

**Admin Actions:**
1. Login with admin credentials
2. Click "Admin Panel" in navbar (top-right)
3. You can now:
   - ✅ Add new agricultural products
   - ✅ Edit existing products
   - ✅ Delete products
   - ✅ View all inventory

### Regular User Account
```
Email: john@example.com
Password: password123
```

Or create your own by clicking "Register" button

## 🌾 Product Categories

The shop has 3 main categories:

### 1. **Seeds** 🌱
- Wheat Seeds
- Tomato Seeds
- Cabbage Seeds
- Price range: ₹300-₹500

### 2. **Fertilizers** 🌾
- NPK Fertilizers
- Urea Fertilizer
- Potassium Chloride
- Price range: ₹280-₹550

### 3. **Pesticides** 🛡️
- Systemic Pesticide
- Neem Oil (Organic)
- Fungicide
- Price range: ₹280-₹650

## 🧪 Step-by-Step Testing

### Test 1: Browse Products
1. Click "Products" in navbar
2. See all 8 sample products
3. Use filters to narrow by category
4. Use search to find specific products
5. Click on any product to see details

### Test 2: Add to Cart
1. Find a product you like
2. Select quantity using + and - buttons
3. Click "Add to Cart"
4. See notification "Added to cart!"
5. Cart count increases in navbar

### Test 3: Checkout Process
1. Click Cart icon (top-right)
2. Review items
3. Click "Proceed to Checkout"
4. Fill shipping information
5. Review order total
6. Click "Place Order"

### Test 4: Admin - Add Product
1. Login with admin account
2. Click "Admin Panel" in navbar
3. Click "Add New Product"
4. Fill form:
   - Product Name: "Organic Neem Oil Plus"
   - Category: Pesticides
   - Price: ₹750
   - Stock: 30
   - Description: "Pure organic neem oil for all crops"
5. Click "Create Product"
6. New product appears in admin table
7. Go back to homepage - see it listed!

### Test 5: Switch Languages
1. Click language buttons (EN / हि) in navbar
2. Entire site switches to Hindi
3. All text, buttons, labels change
4. Verify on different pages

### Test 6: User Authentication
1. Try accessing `/admin/products` without login
   - Should redirect to login
2. Try accessing checkout without login
   - Should redirect to login
3. After login, admin features appear

## 🎨 Design Features

### Navigation Bar
- **Sticky navbar** stays at top while scrolling
- **Language selector** (EN / हि)
- **Cart indicator** shows item count
- **User dropdown** for profile/logout
- **Admin link** only visible to admins

### Product Cards
- **Green theme** with agriculture colors
- **Category badges** (Seeds/Fertilizers/Pesticides)
- **Star ratings** based on customer reviews
- **Stock status** shows availability
- **Quantity controls** with +/- buttons
- **Add to cart button** in vibrant green

### Admin Dashboard
- **Product table** shows all products
- **Edit button** to modify products
- **Delete button** to remove products
- **Add Product form** with all fields
- **Real-time updates** when products change

### Footer
- **Company info** with agriculture branding
- **Quick links** to main pages
- **Contact information**
- **Social media** links
- **Category quick access**

## 🌐 Multi-Language Support

### English (EN)
```
Navigation: Home, Products, Admin Panel, About, Contact
Currency: ₹ (Rupees)
```

### Hindi (हि)
```
Navigation: होम, उत्पाद, एडमिन पैनल, हमारे बारे में, संपर्क करें
Currency: ₹ (रुपये)
```

### Where Language Changes Apply
- ✅ Navigation menu
- ✅ Page headers
- ✅ Button labels
- ✅ Form labels
- ✅ Error messages
- ✅ Footer content
- ✅ Product categories

## 🔐 Security & Features

### Authentication
- ✅ Secure login/register
- ✅ JWT token-based sessions
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes
- ✅ Auto-logout on token expiry

### Authorization
- ✅ Only admins can add/edit/delete products
- ✅ Only logged-in users can checkout
- ✅ Users can only see their orders
- ✅ Role-based access control

## 📊 Sample Data Included

The system comes with 8 sample products:
1. Hybrid Wheat Seeds Premium - ₹450
2. Organic Tomato Seeds - ₹320
3. NPK Fertilizer 20-20-20 - ₹550
4. Urea Fertilizer Premium - ₹280
5. Systemic Pesticide - ₹420
6. Neem Oil Organic - ₹650
7. Cabbage Hybrid Seeds - ₹380
8. Potassium Chloride - ₹320

## 🛠️ Common Tasks

### Add New Product as Admin
```
1. Login as admin
2. Nav: Admin Panel → Products
3. Button: Add New Product
4. Fill details
5. Click: Create Product
```

### Buy Product as User
```
1. Login as user (or register)
2. Browse products
3. Add to cart
4. Go to cart
5. Checkout
6. Fill shipping info
7. Place order
```

### Search Products
```
1. Go to Products page
2. Type in search box
3. Results filter automatically
4. Use category filter for more options
```

### Change Language
```
Click EN or हि in navbar
Entire site switches instantly
```

## 📈 Performance Features

- **Responsive Design**: Works on all devices (mobile, tablet, desktop)
- **Fast Loading**: Optimized images and lazy loading
- **Smooth Animations**: Hover effects and transitions
- **State Management**: Efficient Zustand store
- **API Optimization**: Minimal API calls
- **Caching**: Browser caching for static assets

## 🐛 Troubleshooting

### Products Not Showing
- Restart backend: `npm run dev`
- Check MongoDB connection
- Browser refresh (Ctrl+Shift+R)

### Login Not Working
- Check admin credentials are correct
- Verify backend is running
- Clear browser cookies

### Admin Panel Not Visible
- Ensure you're logged in as admin
- Check user `isAdmin` flag is true
- Reload page after login

### Language Not Changing
- Check i18n is loading correctly
- Verify locale files (en.json, hi.json)
- Check browser console for errors

### Add to Cart Not Working
- Must be logged in as user
- Check cart store in Zustand
- Verify API endpoint is running

## 📱 Responsive Testing

Test on different screen sizes:
- **Desktop** (1920x1080): Full layout
- **Tablet** (768x1024): Adjusted layout
- **Mobile** (375x667): Vertical layout
- **Mobile landscape** (667x375): Compact layout

Use browser DevTools (F12) to test responsiveness.

## 🎯 Key Features Checklist

- ✅ Agriculture-themed greenish design
- ✅ Bootstrap responsive layout
- ✅ Admin product management (add/edit/delete)
- ✅ User authentication (register/login)
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Multi-language support (EN/HI)
- ✅ Product categories (Seeds/Fertilizers/Pesticides)
- ✅ Product search and filtering
- ✅ Product ratings and reviews
- ✅ Secure JWT authentication
- ✅ Role-based authorization
- ✅ Responsive mobile design
- ✅ Professional UI/UX

## 🚀 Next Steps

1. **Populate with Real Data**
   - Import actual agricultural product data
   - Update product images
   - Add real manufacturer information

2. **Integration Enhancements**
   - Add payment gateway (Stripe/Razorpay)
   - Email notifications for orders
   - SMS alerts
   - Push notifications

3. **Marketing Features**
   - Discounts and coupons
   - Wishlist functionality
   - Product recommendations
   - Email newsletters

4. **Analytics**
   - Sales reports
   - Popular products tracking
   - Customer behavior analytics
   - Revenue dashboard

5. **Mobile App**
   - React Native mobile version
   - Push notifications
   - Offline support
   - Native payment integration

---

**Happy Testing! 🌾 Welcome to AgriShop!**
