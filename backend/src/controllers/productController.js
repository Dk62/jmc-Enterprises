const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let sortObj = {};
    if (sort === 'price-asc') sortObj = { price: 1 };
    if (sort === 'price-desc') sortObj = { price: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock, sku } = req.body;

    let product = await Product.findOne({ sku });
    if (product) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product with this SKU already exists' 
      });
    }

    product = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
      sku
    });

    await product.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const review = {
      userId: req.user.id,
      username: req.user.email,
      rating,
      comment,
      createdAt: new Date()
    };

    product.reviews.push(review);
    
    // Update average rating
    const avgRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    product.rating = avgRating;

    await product.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
