const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ethers = require('ethers');
const generateToken = require('../utils/generateToken');
const nodemailer = require('nodemailer');
const path = require('path');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'phonemask000@gmail.com',
    pass: 'qpmcddpxmhfdidfv',
  },
});

// Function to send welcome email
const sendWelcomeEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: '"KARA" <your-email@gmail.com>',
      to: email,
      subject: 'Welcome to KARA!',
      text: 'Thanks for joining KARA! We’re excited to have you on board.',
      html: '<h1>Welcome to KARA!</h1><p>Thanks for joining us! We’re excited to have you on board.</p>',
    });
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    throw new Error('Failed to send welcome email');
  }
};

// Get Nonce
const getNonce = asyncHandler(async (req, res) => {
  const { walletAddress } = req.params;

  if (!ethers || !ethers.utils || typeof ethers.utils.isAddress !== 'function') {
    res.status(500);
    throw new Error('Server configuration error: ethers library not loaded');
  }

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


// Connect Wallet
const connectWallet = asyncHandler(async (req, res) => {
  const { walletAddress, signature, email } = req.body;
  console.log('Request body:', req.body);

  if (!walletAddress || !signature || !ethers.utils.isAddress(walletAddress)) {
    return res.status(400).json({ message: 'Wallet address and signature are required' });
  }

  let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
  const isNewUser = !user;

  if (isNewUser) {
    user = new User({
      walletAddress: walletAddress.toLowerCase(),
      email: email ? email.toLowerCase() : undefined,
      nonce: Math.random().toString(36).substring(2, 15),
    });
    await user.save();
    console.log('New user registered:', user);
  }

  const message = `Connect wallet with nonce: ${user.nonce}`;
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ message: 'Signature does not match' });
    }
  } catch (error) {
    console.error('Signature verification error:', error.message);
    return res.status(400).json({ message: 'Invalid signature format' });
  }

  if (email && email.toLowerCase() !== user.email) {
    user.email = email.toLowerCase();
    if (isNewUser && !user.welcomeEmailSent) {
      await sendWelcomeEmail(email);
      user.welcomeEmailSent = true;
    }
    await user.save();
  }

  user.nonce = null;
  await user.save();
  console.log('User after login:', user);

  const token = generateToken(user._id);
  console.log('Generated token:', token); // Add this
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400 * 7), // 7 days
  });
  res.json({
    _id: user._id,
    walletAddress: user.walletAddress,
    email: user.email,
    avatarUrl: user.avatarUrl,
    token,
    isNewUser,
  });
});

// Get User
const getUser = asyncHandler(async (req, res) => {
  console.log('req.user:', req.user);
  const user = await User.findById(req.user._id).select('-nonce');
  console.log('Found user:', user);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({
    _id: user._id,
    walletAddress: user.walletAddress,
    email: user.email,
    avatarUrl: user.avatarUrl,
    ordersCreated: user.ordersCreated,
    ordersReceived: user.ordersReceived,
    createdAt: user.createdAt,
    welcomeEmailSent: user.welcomeEmailSent,
  });
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { email } = req.body; // Removed displayName
  if (email) {
    const existingUserWithEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== user._id.toString()) {
      res.status(400);
      throw new Error('This email is already associated with another wallet address');
    }
    user.email = email.toLowerCase();
  }

  if (req.files && req.files.avatar) {
    console.log('Received avatar file:', req.files.avatar);
    const avatar = req.files.avatar;
    const avatarUrl = `/uploads/${avatar.name}`;
    const filePath = path.join(__dirname, '..', 'public', avatarUrl);
    console.log('Saving avatar to:', filePath);
    await avatar.mv(filePath);
    user.avatarUrl = avatarUrl;
    console.log('Avatar saved, new avatarUrl:', user.avatarUrl);
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    walletAddress: updatedUser.walletAddress,
    email: updatedUser.email,
    avatarUrl: updatedUser.avatarUrl,
    ordersCreated: updatedUser.ordersCreated,
    ordersReceived: updatedUser.ordersReceived,
    createdAt: updatedUser.createdAt,
    welcomeEmailSent: updatedUser.welcomeEmailSent,
  });
});

// Logout User
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