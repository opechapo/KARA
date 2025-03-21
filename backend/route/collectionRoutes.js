// route/collectionRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Collection = require('../models/Collection');

// Authentication middleware
const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, invalid token');
  }
});

// Get all collections for the authenticated user
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const collections = await Collection.find({ owner: req.user._id });
    res.json(collections);
  })
);

// POST route (already exists, included for completeness)
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { name, shortDescription, store, category, description } = req.body;
    const collection = new Collection({
      name,
      shortDescription,
      store,
      category,
      description,
      owner: req.user._id,
    });

    if (req.files && req.files.generalImage) {
      const imagePath = `/uploads/${req.files.generalImage.name}`;
      await req.files.generalImage.mv(path.join(__dirname, '..', 'public', imagePath));
      collection.generalImage = imagePath;
    }

    const createdCollection = await collection.save();
    res.status(201).json(createdCollection);
  })
);

module.exports = router;