const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true }, // Replaced name
  lastName: { type: String, required: true },  // Replaced name
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  phoneNumber: { type: String, unique: true, sparse: true }, // Added for Nigerian numbers
  isPhoneVerified: { type: Boolean, default: false },       // Verification status
  verificationCode: { type: String },                       // Temporary code
  verificationCodeExpires: { type: Date },                  // Code expiration
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);