// backend/routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400);
    throw new Error('Store name and description are required');
  }
  
  const store = await Store.create({
    name,
    description,
    owner: req.user._id,
  });
  res.status(201).json(store);
}));

module.exports = router;