const User = require('../models/User');
const { ethers } = require('ethers'); // For signature verification
const jwt = require('jsonwebtoken');

const authController = {
  // Get nonce for a wallet address or create new user
  getNonce: async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      let user = await User.findOne({ walletAddress });
      
      // If user doesn't exist, create a new one
      if (!user) {
        user = await User.create({ walletAddress });
      }
      
      res.json({ nonce: user.nonce });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Verify signature and connect wallet
  connectWallet: async (req, res) => {
    try {
      const { walletAddress, signature } = req.body;
      
      // Find user
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify signature
      const message = `Connect wallet with nonce: ${user.nonce}`;
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Generate new nonce after successful verification
      user.nonce = Math.random().toString(36).substring(2);
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, walletAddress: user.walletAddress },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token, user: { walletAddress: user.walletAddress } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = authController;