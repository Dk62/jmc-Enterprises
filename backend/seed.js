const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');
const Product = require('./src/models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jmc_enterprises');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    let admin = await User.findOne({ email: 'admin@jmc.com' });
    
    if (!admin) {
      // Create admin user
      admin = new User({
        username: 'admin',
        email: 'admin@jmc.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true
      });
      await admin.save();
      console.log('✓ Admin user created successfully');
      console.log('  Email: admin@jmc.com');
      console.log('  Password: admin123');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Check if products exist
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      const products = [
        {
          name: 'Hybrid Corn Seeds',
          description: 'High-yield hybrid corn seeds with disease resistance and superior germination',
          price: 450,
          category: 'Seeds',
          stock: 100,
          image: 'https://via.placeholder.com/300?text=Corn+Seeds',
          rating: 4.5
        },
        {
          name: 'Tomato Seedlings',
          description: 'Premium quality tomato seedlings, ready for transplant',
          price: 120,
          category: 'Seeds',
          stock: 200,
          image: 'https://via.placeholder.com/300?text=Tomato+Seeds',
          rating: 4.7
        },
        {
          name: 'Organic NPK Fertilizer',
          description: 'Balanced organic fertilizer with NPK 5-5-5 ratio, suitable for all crops',
          price: 350,
          category: 'Fertilizers',
          stock: 150,
          image: 'https://via.placeholder.com/300?text=NPK+Fertilizer',
          rating: 4.6
        },
        {
          name: 'Natural Pesticide Spray',
          description: 'Eco-friendly pesticide made from natural ingredients, safe for humans',
          price: 280,
          category: 'Pesticides',
          stock: 80,
          image: 'https://via.placeholder.com/300?text=Pesticide',
          rating: 4.4
        },
        {
          name: 'Wheat Seeds - Premium Grade',
          description: 'High-quality wheat seeds with excellent yield potential',
          price: 320,
          category: 'Seeds',
          stock: 120,
          image: 'https://via.placeholder.com/300?text=Wheat+Seeds',
          rating: 4.5
        },
        {
          name: 'Phosphate Fertilizer',
          description: 'Rich phosphate content for better root development and flowering',
          price: 420,
          category: 'Fertilizers',
          stock: 90,
          image: 'https://via.placeholder.com/300?text=Phosphate',
          rating: 4.3
        }
      ];

      await Product.insertMany(products);
      console.log('✓ Sample products created successfully');
    } else {
      console.log(`✓ Database already has ${productCount} products`);
    }

    console.log('\n✓ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
