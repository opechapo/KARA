// models/Collection.js
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  category: { type: String, enum: ['Electronics', 'Smart Phones & Tabs', 'Homes & Gardens', 'Fashion', 'Vehicles'] },
  description: { type: String, trim: true },
  generalImage: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);