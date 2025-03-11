// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Normalize to lowercase for Ethereum addresses
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
  nonce: {
    type: String, // Add nonce field
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);