const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);
router.put('/:id/make-admin', authMiddleware, adminMiddleware, userController.makeAdmin);

module.exports = router;
