// controllers/productController.js
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// Create Product (Seller/Admin only)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;

  if (!name || !description || !price || !stock || !category) {
    res.status(400);
    throw new Error('All required fields must be provided');
  }

  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only sellers or admins can create products');
  }

  const product = await Product.create({
    seller: req.user._id,
    name,
    description,
    price,
    stock,
    category,
    imageUrl: imageUrl || '',
  });

  const populatedProduct = await Product.findById(product._id).populate('seller', 'firstName lastName email');
  res.status(201).json(populatedProduct);
});

// Get All Products (Public)
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('seller', 'firstName lastName email');
  res.json(products);
});

// Get Product by ID (Public)
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'firstName lastName email');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// Update Product (Seller/Admin only, must own the product)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const { name, description, price, stock, category, imageUrl } = req.body;
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price !== undefined ? price : product.price;
  product.stock = stock !== undefined ? stock : product.stock;
  product.category = category || product.category;
  product.imageUrl = imageUrl || product.imageUrl;

  const updatedProduct = await product.save();
  const populatedProduct = await Product.findById(updatedProduct._id).populate('seller', 'firstName lastName email');
  res.json(populatedProduct);
});

// Delete Product (Seller/Admin only, must own the product)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await Product.deleteOne({ _id: product._id });
  res.json({ message: 'Product deleted successfully' });
});

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };