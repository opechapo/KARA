const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, trim: true, lowercase: true, unique: true, sparse: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] },
  avatarUrl: { type: String, trim: true },
  nonce: { type: String },
  ordersCreated: { type: Number, default: 0 },
  ordersReceived: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  welcomeEmailSent: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);