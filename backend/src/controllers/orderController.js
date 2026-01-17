const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    // Prepare order items
    const items = cart.items.map(item => ({
      productId: item.productId._id,
      productName: item.productId.name,
      quantity: item.quantity,
      price: item.price
    }));

    const order = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      totalPrice: cart.totalPrice,
      paymentMethod,
      paymentStatus: 'pending'
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username email')
      .populate('items.productId');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
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

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order cannot be cancelled' 
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      success: true,
      order,
      message: 'Order cancelled'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
