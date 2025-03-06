const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    nonce: {
      type: String,
      default: () => Math.random().toString(36).substring(2),
    },
    transactionHistory: [
      {
        txHash: String,
        amount: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);