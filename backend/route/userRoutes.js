const express = require('express');
const router = express.Router();
const { getNonce, connectWallet, getUser, updateUser, logoutUser } = require('../controller/userController');
const authMiddleware = require('../middleware/auth');
const asyncHandler = require('express-async-handler'); // Add this import
const Product = require('../models/Product'); // Import Product model
const Order = require('../models/Order'); // Import Order model



router.get('/nonce/:walletAddress', getNonce);
router.post('/connect-wallet', connectWallet);
router.get('/profile', authMiddleware, getUser);
router.put('/profile', authMiddleware, updateUser);
router.post('/logout', authMiddleware, logoutUser);

router.get('/listings', authMiddleware, asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
}));

router.get('/purchases', authMiddleware, asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('products.product', 'name price');
  res.json(orders);
}));

// Add transaction routes later, e.g.:
// router.get('/transactions', authMiddleware, getUserTransactions);
// router.post('/transactions', authMiddleware, createTransaction);

module.exports = router;