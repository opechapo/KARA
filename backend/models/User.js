// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, trim: true, lowercase: true, unique: true, sparse: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] },
  displayName: { type: String, trim: true, maxLength: 50 },
  avatarUrl: { type: String, trim: true },
  nonce: { type: String },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  role: { type: String, default: 'buyer' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);