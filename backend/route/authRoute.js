const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Get nonce for wallet authentication
router.get('/nonce/:walletAddress', authController.getNonce);

// Authenticate wallet and generate token
router.post('/connect-wallet', authController.connectWallet);

module.exports = router;