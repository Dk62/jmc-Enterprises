const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getUserOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);
router.post('/:id/cancel', authMiddleware, orderController.cancelOrder);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);

module.exports = router;
