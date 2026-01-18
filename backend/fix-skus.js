const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

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

const fixSKUs = async () => {
  try {
    await connectDB();

    // Find all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    // Generate unique SKUs for products without SKU or with null/empty SKU
    for (const product of products) {
      if (!product.sku) {
        const sanitizedName = product.name.toUpperCase().replace(/\s+/g, '').substring(0, 3);
        const timestamp = Date.now().toString().slice(-6);
        product.sku = `${sanitizedName}-${timestamp}`;
        await product.save();
        console.log(`Generated SKU for ${product.name}: ${product.sku}`);
      }
    }

    console.log('\n✓ All products now have unique SKUs!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixSKUs();
