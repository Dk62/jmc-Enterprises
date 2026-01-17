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

const makeAdmin = async () => {
  try {
    await connectDB();

    // Update admin user to set isAdmin to true
    const result = await User.updateOne(
      { email: 'admin@jmc.com' },
      { $set: { isAdmin: true } }
    );
    
    console.log('✓ Update result:', result);
    
    // Verify the update
    const updated = await User.findOne({ email: 'admin@jmc.com' });
    console.log('\n✓ Updated admin user:');
    console.log(JSON.stringify(updated.toJSON(), null, 2));
    
    console.log('\n═══════════════════════════════════');
    console.log('✓ Admin status updated successfully!');
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
