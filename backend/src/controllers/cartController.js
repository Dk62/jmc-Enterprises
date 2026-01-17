const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock' 
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    // Calculate total price
    let total = 0;
    for (let item of cart.items) {
      total += item.price * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be at least 1' 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    const item = cart.items.find(item => 
      item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not in cart' 
      });
    }

    item.quantity = quantity;

    // Calculate total price
    let total = 0;
    for (let item of cart.items) {
      total += item.price * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId
    );

    // Calculate total price
    let total = 0;
    for (let item of cart.items) {
      total += item.price * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
