// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getNonce, connectWallet,  } = require('../controller/userController');
// getUser, updateUser, logoutUser
const authMiddleware = require('../middleware/auth');


router.get('/nonce/:walletAddress', getNonce);           // Get nonce for wallet
router.post('/connect-wallet', connectWallet);          // Connect wallet
// router.get('/profile', authMiddleware, getUser);        // Get profile
// router.put('/profile', authMiddleware, updateUser);     // Update profile
// router.post('/logout', authMiddleware, logoutUser);     // Logout


module.exports = router;