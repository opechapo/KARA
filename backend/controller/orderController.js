const Order = require('../models/Order');
const Product = require('../models/Product');

const orderController = {
  createOrder: async (req, res) => {
    const { products, shippingAddress } = req.body;
    try {
      let totalAmount = 0;
      const orderProducts = await Promise.all(products.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Product ${product?.name || 'unknown'} out of stock`);
        }
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
        return { product: item.product, quantity: item.quantity, price: product.price };
      }));

      const order = await Order.create({
        buyer: req.user.id,
        products: orderProducts,
        totalAmount,
        shippingAddress,
      });
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await Order.find({ buyer: req.user.id }).populate('products.product');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('products.product');
      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (order.buyer.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      // Add seller check if needed
      order.status = req.body.status;
      await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = orderController;