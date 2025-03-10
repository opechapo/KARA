const express = require('express');
const router = express.Router();
const { createProduct,getProducts,getProductById,updateProduct,deleteProduct } = require('../controller/productController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createProduct);      
router.get('/', getProducts);                           
router.get('/:id', getProductById);                    
router.put('/:id', authMiddleware, updateProduct);      
router.delete('/:id', authMiddleware, deleteProduct);   

module.exports = router;