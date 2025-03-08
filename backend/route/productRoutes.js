const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, restrictTo } = require('../middleware/auth');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', authMiddleware, restrictTo('seller'), productController.createProduct);
router.put('/:id', authMiddleware, restrictTo('seller'), productController.updateProduct);
router.delete('/:id', authMiddleware, restrictTo('seller'), productController.deleteProduct);

module.exports = router;