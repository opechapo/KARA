const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  phoneNumber: { type: String, unique: true, sparse: true }, // sparse allows null values while maintaining uniqueness
  isPhoneVerified: { type: Boolean, default: false },
  verificationCode: { type: String }, // Temporary code for verification
  verificationCodeExpires: { type: Date }, // Expiration time for the code
  // orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
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

