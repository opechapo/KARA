// controllers/userController.js
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const ethers = require('ethers');
const generateToken = require('../utils/generateToken');

const getNonce = asyncHandler(async (req, res) => {
  const { walletAddress } = req.params;

  if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
    res.status(400);
    throw new Error('Invalid wallet address');
  }

  let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
  const nonce = Math.floor(Math.random() * 1000000).toString();

  if (!user) {
    user = await User.create({
      walletAddress: walletAddress.toLowerCase(),
      role: 'buyer',
      nonce,
    });
  } else {
    user.nonce = nonce;
    await user.save();
  }

  console.log('User after setting nonce:', user); // Debug
  res.json({ nonce });
});

const connectWallet = asyncHandler(async (req, res) => {
  const { walletAddress, signature } = req.body;

  console.log('Request body:', req.body);

  if (!walletAddress || !signature || !ethers.utils.isAddress(walletAddress)) {
    res.status(400);
    throw new Error('Wallet address and signature are required');
  }

  const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.nonce) {
    res.status(400);
    throw new Error('Nonce not set for this user');
  }

  const message = `Connect wallet with nonce: ${user.nonce}`;
  console.log('Message to verify:', message);
  console.log('Signature received:', signature);

  let recoveredAddress;
  try {
    recoveredAddress = ethers.utils.verifyMessage(message, signature);
    console.log('Recovered address:', recoveredAddress);
  } catch (error) {
    console.error('Signature verification error:', error.message);
    res.status(400);
    throw new Error('Invalid signature format');
  }

  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    res.status(401);
    throw new Error('Signature does not match wallet address');
  }

  user.nonce = null;
  await user.save();

  const token = generateToken(user._id);
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: 'none',
    secure: true,
  });

  res.json({
    _id: user._id,
    walletAddress: user.walletAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token,
  });
});

// ... (rest of the file unchanged)

module.exports = { getNonce, connectWallet };
// getUser, updateUser, logoutUser