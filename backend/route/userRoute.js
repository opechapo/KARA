const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth'); // We'll create this middleware

// Get user profile
router.get('/:walletAddress', authenticateToken, userController.getUser);

// Update user
router.put('/:walletAddress', authenticateToken, userController.updateUser);

// Add transaction
router.post('/:walletAddress/transaction', authenticateToken, userController.addTransaction);

// Get transaction history
router.get('/:walletAddress/transactions', authenticateToken, userController.getTransactionHistory);

// Delete user
router.delete('/:walletAddress', authenticateToken, userController.deleteUser);

module.exports = router;