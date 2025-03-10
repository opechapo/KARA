const express = require('express');
const router = express.Router();
const { register,loginUser,getUser,updateUser,deleteUser,logoutUser,verifyPhone } = require("../controller/userController");
const authMiddleware = require('../middleware/auth');


router.post("/register", register);
router.post('/login', loginUser);
router.get('/:userId', authMiddleware, getUser);
router.put('/:userId', authMiddleware, updateUser);
router.delete('/:userId', authMiddleware, deleteUser);
router.post('/logout', authMiddleware, logoutUser);
router.post('/verify-phone', authMiddleware, verifyPhone);


module.exports = router;