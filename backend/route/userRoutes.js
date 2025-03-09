const express = require('express');
const router = express.Router();
// const userController = require('../controllers/userController');
const { register,loginUser,getUser,updateUser,deleteUser,logoutUser } = require("../controller/userController");
const authMiddleware = require('../middleware/auth');


router.post("/register", register);
router.post('/login', loginUser);
router.get('/:userId', authMiddleware, getUser);
router.put('/:userId', authMiddleware, updateUser);
router.delete('/:userId', authMiddleware, deleteUser);
router.post('/logout', authMiddleware, logoutUser);


module.exports = router;