// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Basic email validation
  },
  nonce: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);