// route/storeRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Store = require('../models/Store');
const path = require('path');

// Authentication middleware
const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Sets req.user with decoded token data (includes _id)
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, invalid token');
  }
});

// Get all stores for the authenticated user
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
      res.status(401);
      throw new Error('User not authenticated');
    }
    const stores = await Store.find({ owner: req.user._id });
    res.json(stores);
  })
);

// Create a store (unchanged, just for context)
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { name, description, slogan } = req.body;
    const owner = req.user._id;

    const store = new Store({ name, description, slogan, owner });

    if (req.files) {
      if (req.files.bannerImage) {
        const bannerPath = `/uploads/${req.files.bannerImage.name}`;
        await req.files.bannerImage.mv(path.join(__dirname, '..', 'public', bannerPath));
        store.bannerImage = bannerPath;
      }
      if (req.files.featuredImage) {
        const featuredPath = `/uploads/${req.files.featuredImage.name}`;
        await req.files.featuredImage.mv(path.join(__dirname, '..', 'public', featuredPath));
        store.featuredImage = featuredPath;
      }
      if (req.files.logo) {
        const logoPath = `/uploads/${req.files.logo.name}`;
        await req.files.logo.mv(path.join(__dirname, '..', 'public', logoPath));
        store.logo = logoPath;
      }
    }

    const createdStore = await store.save();
    res.status(201).json(createdStore);
  })
);

module.exports = router;