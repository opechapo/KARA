const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
   
    transactionHistory: [
      {
        txHash: String,
        amount: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    referrals: [
      {
        walletAddress: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
