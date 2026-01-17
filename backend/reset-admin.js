const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jmc_enterprises');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const resetAdminPassword = async () => {
  try {
    await connectDB();

    // Find admin user
    const admin = await User.findOne({ email: 'admin@jmc.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      
      const newAdmin = new User({
        username: 'admin',
        email: 'admin@jmc.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true
      });
      await newAdmin.save();
      console.log('✓ Admin user created!');
    } else {
      console.log('✓ Admin user found. Resetting password...');
      
      // Reset password
      admin.password = 'admin123';
      await admin.save();
      console.log('✓ Password reset successfully!');
    }

    console.log('\n═══════════════════════════════════');
    console.log('Admin Credentials:');
    console.log('═══════════════════════════════════');
    console.log('Email:    admin@jmc.com');
    console.log('Password: admin123');
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAdminPassword();
