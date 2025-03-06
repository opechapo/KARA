const User = require('../models/userRoute');

const userController = {
  // Get user by wallet address
  getUser: async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await User.findOne({ walletAddress });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update user (could be used for adding additional user data later)
  updateUser: async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const updates = req.body;
      
      const user = await User.findOneAndUpdate(
        { walletAddress },
        updates,
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Add transaction to history
  addTransaction: async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const { txHash, amount } = req.body;

      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.transactionHistory.push({ txHash, amount });
      await user.save();

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get transaction history
  getTransactionHistory: async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user.transactionHistory);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      const user = await User.findOneAndDelete({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = userController;