const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  nonce: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);