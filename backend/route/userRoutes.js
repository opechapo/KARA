// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getNonce, connectWallet, getUser, updateUser, logoutUser } = require('../controller/userController');
const authMiddleware = require('../middleware/auth');

router.get('/nonce/:walletAddress', getNonce);
router.post('/connect-wallet', connectWallet);
router.get('/profile', authMiddleware, getUser);
router.put('/profile', authMiddleware, updateUser);
router.post('/logout', authMiddleware, logoutUser);

// Add transaction routes later, e.g.:
// router.get('/transactions', authMiddleware, getUserTransactions);
// router.post('/transactions', authMiddleware, createTransaction);

module.exports = router;