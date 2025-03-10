const User = require("../models/User");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const generateToken = require("../utils/generateToken");
const twilio = require('twilio');

// Validate Twilio credentials before initializing
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  console.error('Invalid or missing TWILIO_ACCOUNT_SID. It must start with "AC".');
  process.exit(1);
}
if (!process.env.TWILIO_AUTH_TOKEN) {
  console.error('Missing TWILIO_AUTH_TOKEN.');
  process.exit(1);
}
if (!process.env.TWILIO_PHONE_NUMBER) {
  console.error('Missing TWILIO_PHONE_NUMBER.');
  process.exit(1);
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Register User
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, phoneNumber } = req.body;

  if (!email || !password || !firstName || !lastName || !role || !phoneNumber) {
    res.status(400);
    throw new Error("All fields are required");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }
  if (password.length > 20) {
    res.status(400);
    throw new Error("Password must not exceed 20 characters");
  }
  if (!phoneNumber.match(/^\+234[0-9]{10}$/)) {
    res.status(400);
    throw new Error("Invalid Nigerian phone number format (e.g., +2348012345678)");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const phoneExists = await User.findOne({ phoneNumber });
  if (phoneExists) {
    res.status(400);
    throw new Error("Phone number already exists");
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role,
    phoneNumber,
    verificationCode,
    verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  await client.messages.create({
    body: `Your verification code is: ${verificationCode}. It expires in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });

  const token = generateToken(user._id);
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: 'none',
    secure: true,
  });

  const { _id, email: userEmail, firstName: userFirstName, lastName: userLastName, role: userRole } = user;
  res.status(201).json({ _id, email: userEmail, firstName: userFirstName, lastName: userLastName, role: userRole });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (!user.isPhoneVerified) {
    res.status(403);
    throw new Error("Phone number not verified");
  }

  const token = generateToken(user._id);
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: 'none',
    secure: true,
  });

  const { _id, email: userEmail, firstName, lastName, role } = user;
  res.json({ _id, email: userEmail, firstName, lastName, role });
});

// Get User Profile
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -verificationCode -verificationCodeExpires');
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { _id, email, firstName, lastName, role, phoneNumber, isPhoneVerified } = user;
  res.json({ _id, email, firstName, lastName, role, phoneNumber, isPhoneVerified });
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { email, firstName, lastName, password, role, phoneNumber } = req.body;

  if (email) user.email = email;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (password) {
    if (password.length < 8) {
      res.status(400);
      throw new Error("Password must be at least 8 characters");
    }
    if (password.length > 20) {
      res.status(400);
      throw new Error("Password must not exceed 20 characters");
    }
    user.password = password;
  }
  if (role) user.role = role;
  if (phoneNumber && phoneNumber !== user.phoneNumber) {
    if (!phoneNumber.match(/^\+234[0-9]{10}$/)) {
      res.status(400);
      throw new Error("Invalid Nigerian phone number format");
    }
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      res.status(400);
      throw new Error("Phone number already exists");
    }
    user.phoneNumber = phoneNumber;
    user.isPhoneVerified = false;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await client.messages.create({
      body: `Your new verification code is: ${verificationCode}. It expires in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  }

  const updatedUser = await user.save();
  const { _id, email: updatedEmail, firstName: updatedFirstName, lastName: updatedLastName, role: updatedRole, phoneNumber: updatedPhone, isPhoneVerified } = updatedUser;
  res.json({ _id, email: updatedEmail, firstName: updatedFirstName, lastName: updatedLastName, role: updatedRole, phoneNumber: updatedPhone, isPhoneVerified });
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await User.deleteOne({ _id: user._id });
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ message: "User deleted successfully" });
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ message: "Logged out successfully" });
});

// Verify Phone Number
const verifyPhone = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (!code) {
    res.status(400);
    throw new Error("Verification code is required");
  }
  if (!user.verificationCode || user.verificationCodeExpires < Date.now()) {
    res.status(400);
    throw new Error("Verification code expired or invalid");
  }
  if (user.verificationCode !== code) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  user.isPhoneVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  res.json({ message: "Phone number verified successfully" });
});

module.exports = { register, loginUser, getUser, updateUser, deleteUser, logoutUser, verifyPhone };