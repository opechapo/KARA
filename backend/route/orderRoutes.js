const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getOrders);
router.get('/:id', authMiddleware, orderController.getOrder);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;