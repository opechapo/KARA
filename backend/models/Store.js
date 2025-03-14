const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collections: [{
    name: { type: String, required: true },
    category: { type: String, enum: ['Electronics', 'Smart Phones & Tabs', 'Homes & Gardens', 'Fashion', 'Vehicles'], required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  }],
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);