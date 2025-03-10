const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {  // Product name
    type: String,
    required: true,
    trim: true,
  },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0, },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true, enum: ['Electronics','Smart Phones & Tabs','Homes & Gardens', 'Fashion', 'Vehicles'] },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: {
    type: String,
    default: '',}
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);