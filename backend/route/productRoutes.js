// route/productRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const path = require('path');

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

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const {
      name, shortDescription, store, category, collection, description,
      amount, price, paymentToken, escrowSystem, vendorDeposit, customerDeposit
    } = req.body;

    const product = new Product({
      name, shortDescription, store, category, collection, description,
      amount, price, paymentToken, escrowSystem,
      vendorDeposit: escrowSystem === 'Deposit' ? vendorDeposit : undefined,
      customerDeposit: escrowSystem === 'Deposit' ? customerDeposit : undefined,
      owner: req.user._id,
    });

    if (req.files && req.files.generalImage) {
      const imagePath = `/uploads/${req.files.generalImage.name}`;
      await req.files.generalImage.mv(path.join(__dirname, '..', 'public', imagePath));
      product.generalImage = imagePath;
    }

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  })
);

module.exports = router;