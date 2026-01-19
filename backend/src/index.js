const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
console.log('Loading routes...');
try {
  console.log('Loading auth routes...');
  app.use('/api/auth', require('./routes/auth.routes'));
  console.log('Loading product routes...');
  app.use('/api/products', require('./routes/product.routes'));
  console.log('Loading cart routes...');
  app.use('/api/cart', require('./routes/cart.routes'));
  console.log('Loading order routes...');
  app.use('/api/orders', require('./routes/order.routes'));
  console.log('Loading user routes...');
  app.use('/api/users', require('./routes/user.routes'));
  console.log('Loading payment routes...');
  app.use('/api/payments', require('./routes/payment.routes'));
  console.log('All routes loaded successfully');
} catch(e) {
  console.error('Error loading routes:', e.message);
  console.error(e.stack);
  process.exit(1);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');
    
    const PORT = process.env.PORT || 5000;
    console.log('Starting server on port', PORT);
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
