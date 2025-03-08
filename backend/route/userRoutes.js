const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { register } = require("../controller/userController");
// , loginUser, logoutUser, getUser, deleteUser, updateUser

// const { authMiddleware } = require('../middleware/auth');

router.post("/register", register);
// router.post('/login', loginUser);
// router.get('/:userId', protectUser, getUser);
// router.patch('/:userId', protectUser, updateUser);
// router.delete('/:userId', protectUser, deleteUser);
// router.post('/logout', logoutUser);

// router.get('/profile', authMiddleware, userController.getProfile);
// router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;