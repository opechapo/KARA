const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const ethers = require('ethers');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

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
      nonce,
    });
  } else {
    user.nonce = nonce;
    await user.save();
  }

  console.log('User after setting nonce:', user);
  res.json({ nonce });
});

const connectWallet = asyncHandler(async (req, res) => {
  const { walletAddress, signature, email } = req.body;

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

  let existingUserWithEmail = null;
  if (email) {
    existingUserWithEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserWithEmail && existingUserWithEmail.walletAddress !== walletAddress.toLowerCase()) {
      res.status(400);
      throw new Error('This email is already associated with another wallet address');
    }
    user.email = email.toLowerCase();
  }

  user.nonce = null;
  await user.save();

  if (email && (!existingUserWithEmail || existingUserWithEmail.walletAddress === walletAddress.toLowerCase())) {
    try {
      await sendEmail(
        user.email,
        'Welcome to KARA!',
        `Hello,\n\nYour wallet (${user.walletAddress}) has been successfully connected to KARA. You can now buy and sell on the platform.\n\nThanks,\nThe KARA Team`
      );
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError.message);
    }
  }

  const token = generateToken(user._id);
  console.log('Generated token:', token);
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
    email: user.email,
    token,
  });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-nonce');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({
    _id: user._id,
    walletAddress: user.walletAddress,
    email: user.email,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { email } = req.body;
  if (email) {
    const existingUserWithEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== user._id.toString()) {
      res.status(400);
      throw new Error('This email is already associated with another wallet address');
    }
    user.email = email.toLowerCase();
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    walletAddress: updatedUser.walletAddress,
    email: updatedUser.email,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = { getNonce, connectWallet, getUser, updateUser, logoutUser };