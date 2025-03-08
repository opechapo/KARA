const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-verification', authMiddleware, authController.sendVerificationCode);
router.post('/verify-phone', authMiddleware, authController.verifyPhoneNumber);

module.exports = router;