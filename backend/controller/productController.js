const Product = require('../models/Product');

const productController = {
  createProduct: async (req, res) => {
    const { name, description, price, stock, category, images } = req.body;
    try {
      const product = await Product.create({
        name, description, price, stock, category, images,
        seller: req.user.id,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await Product.find().populate('seller', 'name email');
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('seller', 'name email');
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      await product.remove();
      res.json({ message: 'Product deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = productController;